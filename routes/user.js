import express from 'express';
import { db } from '../config.js';

export const routerUser = express.Router();

routerUser.get('/api/user/list', async (req, res) => {
  res.json(['projectid1', 'projectid2']);
});
