import express, { urlencoded, json } from 'express';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cloudinary from 'cloudinary';
import compression from 'compression';
import enforce from 'express-sslify';

import connectDB from './config/db.js';

import user from './routes/user-router.js';
import category from './routes/category-router.js';
import upload from './routes/upload-router.js';
import product from './routes/product-router.js';
import payment from './routes/payment-router.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.env.NODE_ENV !== 'production' && dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const app = express();

// Body parser
app.use(urlencoded({ extended: false }));
app.use(json());

app.use(cookieParser());
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// Logger
process.env.NODE_ENV !== 'production' && app.use(morgan('dev'));

// Connect to MongoDB
connectDB();

// Routes
app.use('/user', user);
app.use('/api', category);
app.use('/api', upload);
app.use('/api', product);
app.use('/api', payment);

if (process.env.NODE_ENV === 'production') {
  app.use(compression());
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.get('/service-worker.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'service-worker.js'));
});

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
