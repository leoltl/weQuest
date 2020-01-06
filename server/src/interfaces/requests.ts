export interface Request {
  id: number;
  name: string;
  password: string;
  email: string;
  postal_code: string;
  latitude: number;
  longtitude: number;
}

export interface Requests {
  Request_list: Request[];
}
