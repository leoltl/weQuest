// tslint:disable: import-name
import { Router } from 'express';
import DB from '../lib/db';
import Storage from '../lib/storage';
import { accessControl } from '../lib/utils';
import Item, { ItemInterface } from '../models/item';

export default class ItemController {
  public path: string = '/api/items';
  public router: Router = Router();
  public model = new Item();

  constructor(public db: DB, public storage: Storage) {
    this.init();
  }

  private init() {
    // confirm that user is authenticated
    this.router.use(accessControl);

    // declare routes
    this.router
      .route('/')
      .get(async (req, res) => {
        try {
          const output = await this.getAllByUser(req.session!.userId);
          res.json(output);
        } catch (err) {
          res.status(404).json({ error: 'Failed to retrieve items for user' });
        }
      })
      .post(async (req, res) => {
        try {
          const output = await this.create({
            ...req.body,
            userId: req.session!.userId,
          });
          res.json(output);
        } catch (err) {
          res.status(404).json({ error: 'Failed to save item' });
        }
      });
  }

  public async getAllByUser(id: number): Promise<Partial<ItemInterface>[]> {
    const items: ItemInterface[] = await this.model
      .findByUser(id)
      .run(this.db.query);
    return items.map(
      ({ id, name, description, pictureUrl }): Partial<ItemInterface> => {
        return { id, name, description, pictureUrl };
      },
    );
  }

  public async create(input: Partial<ItemInterface>) {
    return this.db.transaction(
      async (query): Promise<Partial<ItemInterface>> => {
        // check that input includes image as model will validate dummy example.com (front-end pictureUrl is a base64 string)
        if (typeof input.pictureUrl !== 'string' || !input.pictureUrl)
          throw Error('No picture supplied');

        const item: ItemInterface = (
          await this.model
            .create({ ...input, pictureUrl: 'https://example.com' })
            .run(query)
        )[0];

        // check that item has been created
        if (!item) throw Error('No record created');

        // upload image to storage
        const { url } = await this.storage.upload64(
          input.pictureUrl,
          `item-${item.id}`,
        );

        // update item with saved picture url
        const { id, name, description, pictureUrl } = (
          await this.model
            .update({ pictureUrl: url })
            .where({ id: item.id })
            .run(query)
        )[0];

        return { id, name, description, pictureUrl };
      },
    );
  }
}
