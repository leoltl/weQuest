/*
 * All routes for Requests are defined here
 * Since this file is loaded in server.js into api/users,
 * these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
import { getAllRequests } from '../services/request';

module.exports = db => {
  router.route('/').get(async (req, res) => {
    try {
      const requests = await getAllRequests(db);
      res.json(requests);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};
