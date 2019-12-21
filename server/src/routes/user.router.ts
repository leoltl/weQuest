/*
 * All routes for Requests are defined here
 * Since this file is loaded in server.js into api/users,
 * these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */
import express, { Request, Response } from 'express';
import UserService from '../services/UserService';

export const userRouter = express.Router();

userRouter.GET('/', async (req: Request, res: Response) => {
  try {
    const users: Users = await UserService.findAll();
    res.status(200).send(users);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/* GET users/:id */
userRouter.GET('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  try {
    const user: User = await UserService.find(id);
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/* POST users/ */
userRouter.POST('/', async (req: Request, res: Response) => {
  try {
    const user: User = req.body.user;
    await UserService.create(user);
    res.status(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* PUT users/ */
userRouter.PUT('/', async (req: Request, res: Response) => {
  try {
    const user: User = req.body.user;
    await UserService.update(user);
    res.status(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* DELETE users/:id */
userRouter.DELETE('/:id', async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    await UserService.remove(id);
    res.status(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
