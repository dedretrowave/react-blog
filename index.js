import express from 'express';
import mongoose from 'mongoose';
import { Router } from "./Core/Router.js";
import dotenv from "dotenv";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

mongoose.connect(
  process.env.MONGODB_CONNECTION
)
  .then(() => {
    console.log('DB Connected')
  })
  .catch(err => console.log('DB ERROR ' + err))

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.use('./uploads', express.static('uploads'));

Router(app, cloudinary);

app.listen(process.env.SERVER_PORT, err => {
  if (err) {
    console.log(err);
  }

  console.log('Server launched');
})