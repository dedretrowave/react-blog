import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose, {mongo} from 'mongoose';
import { Router } from "./Core/Router.js";
import dotenv from "dotenv";


dotenv.config();

mongoose.connect(
  'mongodb+srv://pvrvd0xmail:1488@blog.nwd6f86.mongodb.net/?retryWrites=true&w=majority'
)
  .then(() => {
    console.log('DB Connected')
  })
  .catch(err => console.log('DB ERROR ' + err))

const app = express();

app.use(express.json());

Router(app);

app.listen(process.env.SERVER_PORT, err => {
  if (err) {
    console.log(err);
  }

  console.log('Server launched');
})