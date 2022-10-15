import express from 'express';
import { db } from '../config.js';

export const routerWorker = express.Router();

/**
 * theory:
 * - worker wants a job for project id "proteinfolding"
 *   - makes request to /api/worker/request-job and gets jobid, code, and parameters
 * - worker submits result to /api/worker/submit with jobid and gets points for it
 */

routerWorker.get('/api/worker/list', async (req, res) => {
  res.json(await db.collection('users').find({}, { projection: { _id: 0 } }).toArray());
});

routerWorker.get('/api/worker/request-job', async (req, res) => {
  if (!req.query.projectid) {
    res.status(400).json({ err: 'must include projectid' });
    return;
  }
});

routerWorker.get('/api/worker/submit', (req, res) => {});