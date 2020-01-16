/*
* Socket interface
*/

// tslint:disable: import-name
import socketIO from 'socket.io';
import http from 'http';
import { socketSessionIdParser, SessionIdStore } from './utils';

export type SocketParams = {
  server: http.Server,
  path?: string,
  sessionIdStore?: SessionIdStore,
};

export type SocketEmitOptions = {
  eventKey?: string,
  sessionId?: string,
  queue?: string,
};

export type SocketBroadcastOptions = {
  eventKey?: string,
  queue?: string,
};

export default class Socket {

  private io: socketIO.Server | null = null;
  // CLIENT LOOKUP
  // sessionId to client
  private clients: Record<string, socketIO.Socket> = {};
  // client to sessinId
  private sessions: Map<socketIO.Socket, string> = new Map();
  private sessionIdStore: SessionIdStore | undefined;

  // SUBSCRIPTIONS LOOKUP - uses set instead of arrays for constant time add/delete operations
  // event to sockets
  private events: Record<string, Record<string, Set<socketIO.Socket>>> = {};
  // socket to events
  private subscriptions: Map<socketIO.Socket, Record<string, Set<string>>> = new Map();

  private static instances: Socket[] = [];
  private static instanceEqualityChecks: (keyof SocketParams)[] = ['server', 'path', 'sessionIdStore'];

  constructor(private params: SocketParams) {
    const existingInstance = Socket.findInstance(params);
    if (existingInstance) return existingInstance;

    this.io = params.path
      ? socketIO(params.server, { path: params.path, transports: ['websocket'] })
      : socketIO(params.server, { transports: ['websocket'] });

    // register sessionIdStore if provided (to store authId <-> socketId combos)
    'sessionIdStore' in params && (this.sessionIdStore = params.sessionIdStore);

    // register middleware to attach sessionId to client objects
    this.io.use(socketSessionIdParser);

    // init
    this.io.on('connection', (client) => {

      client.sessionId = client.id;

      this.registerSocket(client);
      client.on('disconnect', () => this.unregisterSocket(client));
    });

    Socket.registerInstance(this);
  }

  private static findInstance(params: SocketParams): Socket | undefined {
    return this.instances.find(
      (instance: Socket): boolean => {
        return this.instanceEqualityChecks.every((param): boolean => instance.params[param] === params[param]);
      });
  }

  private static registerInstance(instance: Socket): void {
    this.instances.push(instance);
  }

  private registerSocket(client: socketIO.Socket) {
    console.log('Registering socket', client.sessionId);

    // add client to lookup maps
    const sessionId = client.sessionId!;
    this.clients[sessionId] = client;
    this.sessions.set(client, sessionId);

    // subscribe all to 'notifications' event (so notifications can be broadcast to all clients)
    this.subscribe(sessionId, 'notifications');
  }

  private unregisterSocket(client: socketIO.Socket) {
    const sessionId = client.sessionId!;
    console.log('Unregistering socket', sessionId);

    // unsubscribe from all
    this.unsubscribe(sessionId);

    // remove client from lookup maps
    delete this.clients[sessionId];
    this.sessions.delete(client);

    // remove sessionId from sessionIdStore if provided
    this.sessionIdStore && this.sessionIdStore.delete({ sessionId });

  }

  public subscribe(sessionId: string, event: string, eventKey = 'default'): this {
    const client = this.clients[sessionId];
    // if (!client) throw Error('Socket client is not registered');
    if (!client) {
      console.error('ERROR: Attempting to subscribe but socket client is not registered');
      console.error('SessionId', sessionId);
      return this;
    }

    // add client to event
    this.events[event] = this.events[event] || {};
    this.events[event][eventKey] = this.events[event][eventKey] || new Set();
    this.events[event][eventKey].add(client);

    // add event to client's subscriptions
    const subscriptions = this.subscriptions.get(client) || {};
    subscriptions[event] = subscriptions[event] || new Set();
    subscriptions[event].add(eventKey);
    this.subscriptions.set(client, subscriptions);

    return this;
  }

  // unsubscribe from all if event is not supplied
  public unsubscribe(sessionId: string, event?: string, eventKey?: string): this {

    const client = this.clients[sessionId];

    // client should always exist when function called from unregisterSocket
    // if (!client) throw Error('Socket client is not registered');
    if (!client) {
      console.error('ERROR: Attempting to unsubscribe but socket client is not registered');
      return this;
    }
    const subscriptions = this.subscriptions.get(client);
    // exit if no subscriptions
    if (!subscriptions) return this;

    // unsubscribe from individual event
    if (event) {
      if (!this.events[event] || !subscriptions[event]) {
        console.error('ERROR: Attempting to unsubscribe from an event that does not exist or that the user is not subscribed to');
        return this;
      }

      // unsubscribe from eventKey only if supplied
      if (eventKey) {
        this.events[event][eventKey] && this.events[event][eventKey].delete(client);
        // remove from subscriptions
        subscriptions[event].delete(eventKey);

        return this;
      }

      // if no eventKey, unsubscribe from all eventKeys
      for (const eventKey of subscriptions[event]) {
        this.unsubscribe(sessionId, event, eventKey);
      }

      // remove from subscriptions
      delete subscriptions[event];

      return this;
    }

    // unsubscribe client from all subscriptions
    for (const [subscription, eventKeys] of Object.entries(subscriptions)) {
      // unsubscribe from individual eventKeys
      for (const eventKey of eventKeys) {
        this.unsubscribe(sessionId, subscription, eventKey);
      }
      // unsubscribe from event
      this.unsubscribe(sessionId, subscription);
    }

    // delete client key in subscriptions
    this.subscriptions.delete(client);

    return this;

  }

  public emit(event: string, data: any, options: SocketEmitOptions = {}): this {
    console.log(`SOCKET EMITTING EVENT ${event}${options.sessionId ? `TO ${options.sessionId}` : ''}`, data);

    // set default options parameters
    const eventKey = options.eventKey || 'default';
    const sessionId = options.sessionId;
    const queue = options.queue;

    // single client
    if (sessionId) {
      const client = this.clients[sessionId];
      client && (queue !== undefined
        && client.emit(queue || 'queue', { event, eventKey, data })
        || client.emit(event, { eventKey, data })
      );
      return this;
    }

    // get subscribers for event
    const clients = this.events[event] && this.events[event][eventKey];

    // exit if event was never initialized i.e. has no subscribers
    if (!clients) return this;

    // broadcast
    for (const client of clients) {
      queue !== undefined
        && client.emit(queue || 'queue', { event, eventKey, data })
        || client.emit(event, { eventKey, data });
    }

    return this;
  }

  public emitNotification(sessionId: string, data: any): this {
    this.emit('notifications', data, { sessionId });
    return this;
  }

  public broadcast(event: string, data: any, options: SocketBroadcastOptions): this {
    this.emit(event, data, options);
    return this;
  }

  public broadcastToQueue(event: string, data: any, options: SocketBroadcastOptions): this {
    // set default options parameters
    const queue = options.queue || 'queue';
    this.emit(event, data, { ...options, queue });
    return this;
  }

  // broadcast a 'notifications' event to all clients
  public broadcastToNotifications(data: any): this {
    this.emit('notifications', data);
    return this;
  }

}
