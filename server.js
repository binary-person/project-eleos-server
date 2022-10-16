import express from 'express';
import { routerProjects } from './routes/projects.js';
import { routerUser } from './routes/user.js';
import { routerWorker } from './routes/worker.js';

const app = express();

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization');
  next();
});

app.use(routerProjects);
app.use(routerWorker);
app.use(routerUser);

app.listen(7788, () => console.log('server listening on port 7788'));

listen
