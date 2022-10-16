import express from 'express';
import { db } from '../config.js';

export const routerProjects = express.Router();

/**
 * theory of operation:
 * - someone creates a project
 */

/**
 * /api/projects => lists all projects
 * /api/projects/create create a project
 */
routerProjects.get('/api/projects', async (_req, res) => {
  res.json(await db.collection('projects').find({}, { projection: { _id: 0 } }).toArray());
});

routerProjects.get('/api/projects/refreshdemo', async (req, res) => {
  const inputNum = parseInt(req.query.tasks || 10);
  const numOfTasks = isNaN(inputNum) ? 10 : inputNum;

  const taskData = {};
  for (let i = 1; i <= numOfTasks; i++) {
    taskData[i] = null;
  }

  await db.collection('projects').deleteOne({ id: 'prj_demo' });
  await db.collection('projects').insertOne({
    id: 'prj_demo',
    name: 'Intense matrix multiplication',
    description: 'each job multiplies a 1000 x 1000 array of numbers, in ascending order, by an incrementing number',
    tags: ['machine learning'],
    icon: 'https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png',
    tasks: numOfTasks,
    code: `run = function(taskId) {
      const c = 10000;
      let result = 1;
      for (let i = 0; i < c; i++) {
        for (let j = 0; j < c; j++) {
          result += ((i * 10) + j) * taskId;
        }
      }
      return result;
    }`,
    completed: false,
    taskData,
    location: 'USA',
    pricePerTask: 0.03
  });
  res.json({});
});

routerProjects.get('/api/projects/demousers', async (_req, res) => {
  res.json({ count: (await db.collection('users').find({ projects: 'prj_demo' }).toArray()).length });
});

routerProjects.get('/api/projects/demoresult', async (_req, res) => {
  const project = await db.collection('projects').findOne({ id: 'prj_demo' });
  if (!project.completed) {
    return res.json({ done: false });
  }

  let result = 0;
  for (const taskId in project.taskData) {
    result += parseFloat(project.taskData[taskId]);
  }
  res.json({ done: true, result });
});

// in the finished product, we'd have a UI for adding/deleting projects
// routerProjects.get('/api/projects/create');
// routerProjects.get('/api/projects/delete');
