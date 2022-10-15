import dotenv from 'dotenv-flow';
import { MongoClient } from 'mongodb';
import admin from 'firebase-admin';
import fs from 'fs';
dotenv.config();

const client = new MongoClient(process.env.MONGODB_URL);
await client.connect();
export const db = client.db('project-eleos');
await db.collection('projects').createIndex({ id: 1 }, { unique: true });

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync('firebase-service-account.json')))
});
