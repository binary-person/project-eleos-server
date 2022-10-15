import express from 'express';
import { db } from '../config.js';

export const routerProjects = express.Router();

/**
 * /api/projects => lists all projects
 * /api/projects/create create a project
 */
routerProjects.get('/api/projects', async (_req, res) => {
  res.json(await db.collection('projects').find({}, { projection: { _id: 0 } }).toArray());
});

// if we have time, we can add authentication
// routerProjects.get('/api/projects/create');
// routerProjects.get('/api/projects/delete');
