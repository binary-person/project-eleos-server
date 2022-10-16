import express from 'express';
import { db } from '../config.js';
import decodeIDToken from '../util/decodeIDToken.js';

export const routerUser = express.Router();

routerUser.get('/api/user', decodeIDToken, async (req, res) => {
  const user = (await db.collection('users').find({ id: req.currentUser.email }, { projection: { _id: 0 } }).toArray())[0];

  if (!user) {
    const newUser = {
      id: req.currentUser.email,
      displayName: req.currentUser.name,
      projects: [],
      projectEarnings: {},
      tasksCompleted: {}
    };
    await db.collection('users').insertOne(newUser);
    return res.json(newUser);
  }

  return res.json(user);
});

routerUser.get('/api/user/addProject', decodeIDToken, async (req, res) => {
  if (!req.query.id) {
    return res.status(400).json({ err: 'missing projectid' });
  }
  if (!await db.collection('projects').findOne({ id: req.query.id })) {
    return res.status(400).json({ err: 'cannot find projectid' });
  }
  await db.collection('users').updateOne({ id: req.currentUser.email }, { $push: { projects: req.query.id } });
  res.json({});
});

routerUser.get('/api/user/removeProject', decodeIDToken, async (req, res) => {
  if (!req.query.id) {
    return res.status(400).json({ err: 'missing projectid' });
  }
  if (!await db.collection('projects').findOne({ id: req.query.id })) {
    return res.status(400).json({ err: 'cannot find projectid' });
  }
  await db.collection('users').updateOne({ id: req.currentUser.email }, { $pull: { projects: req.query.id } });
  res.json({});
});
