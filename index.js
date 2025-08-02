import './debug-routes.mjs';
import dotenv from 'dotenv';
dotenv.config();

import app from './server.js';
import { MongoClient } from 'mongodb';
import ReviewsDAO from './dao/reviewsDAO.js';

const uri  = process.env.MONGODB_URI;
const port = process.env.PORT || 8000;

const client = new MongoClient(uri, {
    maxPoolSize: 50,
    serverSelectionTimeoutMS: 5000,
  });
  
  async function startServer() {
    try {
      await client.connect();              
      await ReviewsDAO.injectDB(client);   
      app.listen(port, () =>
        console.log(`listening on port ${port}`)
      );
    } catch (err) {
      console.error('Mongo connection failed:', err.message);
      process.exit(1);
    }
  }
  
  startServer();
