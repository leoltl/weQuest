// tslint:disable: import-name
import { Router } from 'express';
import DB from '../lib/db';
import Storage from '../lib/storage';
import { accessControl } from '../lib/utils';
import Item, { ItemInterface } from '../models/item';

export default class ItemRouter {
  public path: string = '/api/items';
  public router: Router = Router();
  public model = new Item();

  constructor(db: DB, storage: Storage) {
    this.init(db, storage);
  }

  private init(db: DB, storage: Storage) {
    // confirm that user is authenticated
    this.router.use(accessControl);

    // declare routes
    this.router
      .route('/')
      .get(async (req, res) => {
        try {
          const items: ItemInterface[] = await this.model
            .findByUser(req.session!.userId)
            .run(db.query);

          const output = items.map(
            ({ id, name, description, pictureUrl }): Partial<ItemInterface> => {
              return { id, name, description, pictureUrl };
            },
          );

          res.json(output);
        } catch (err) {
          res.status(404).json({ error: 'Failed to retrieve items for user' });
        }
      })
      .post(async (req, res) => {
        try {
          const output: ItemInterface = await db.transaction(async query => {
            const input = {
              ...req.body,
              pictureUrl:
                'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80',
              userId: req.session!.userId,
            };
            const item: ItemInterface = (
              await this.model.create(input).run(query)
            )[0];

            // check that item has been created
            if (!item) throw Error('No record created');

            // upload image to storage
            const { url } = await storage.upload64(
              req.body.pictureUrl,
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
          });

          // send item to front-end
          res.json(output);
        } catch (err) {
          res.status(404).json({ error: 'Failed to save item' });
        }
      });
  }
}
