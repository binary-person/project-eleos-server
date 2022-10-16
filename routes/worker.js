import express from 'express';
import { db } from '../config.js';
import decodeIDToken from '../util/decodeIDToken.js';

export const routerWorker = express.Router();

/**
 * worker flow:
 * - worker wants a job for project id "proteinfolding"
 *   - makes request to /api/worker/request-job and gets jobid, code, and parameters
 * - worker submits result to /api/worker/submit with jobid and gets points for it
 */

let pullJobCounter = 0;
routerWorker.get('/api/worker/request-job', decodeIDToken, async (req, res) => {
  if (!req.query.projectid) {
    return res.status(400).json({ err: 'must include projectid' });
  }

  const project = await db.collection('projects').findOne({ id: req.query.projectid });

  if (!project) {
    return res.status(400).json({ err: 'cannot find projectid' });
  }

  const unstartedTasks = [];

  if (project.completed) {
    return res.json({ taskId: null });
  }
  
  for (const id in project.taskData) {
    if (project.taskData[id] === null) {
      unstartedTasks.push(id);
    }
  }

  if (unstartedTasks.length === 0) {
    await db.collection('projects').updateOne({ id: req.query.projectid }, { $set: { completed: true } });
    return res.json({ taskId: null });
  } else {
    return res.json({
      taskId: unstartedTasks[pullJobCounter++ % unstartedTasks.length],
      code: project.code
    });
  }
});

routerWorker.get('/api/worker/submit', decodeIDToken, async (req, res) => {
  if (!req.query.projectid) {
    return res.status(400).json({ err: 'must specify projectid' });
  }
  if (typeof req.query.taskId === 'undefined') {
    return res.status(400).json({ err: 'must specify taskId' });
  }
  if (typeof req.query.result === 'undefined') {
    return res.status(400).json({ err: 'must specify result' });
  }

  const updateResult = await db.collection('projects').findOneAndUpdate({ id: req.query.projectid }, {
    $set: { ['taskData.' + req.query.taskId]: req.query.result }
  });

  if (updateResult.ok === 0) {
    return res.status(500).json({ err: 'unknown error occurred while trying to update task data' });
  }

  if (updateResult.value?.taskData[req.query.taskId] === null) {
    // possible race condition but we'll fix during refinement
    const user = await db.collection('users').findOne({ id: req.currentUser.email });
    await db.collection('users').updateOne({ id: req.currentUser.email }, {
      $set: {
        ['projectEarnings.' + req.query.projectid]: updateResult.value.pricePerTask + (user.projectEarnings[req.query.projectid] || 0),
        ['tasksCompleted.' + req.query.projectid]: 1 + (user.tasksCompleted[req.query.projectid] || 0)
      }
    });
  }

  res.json({});
});