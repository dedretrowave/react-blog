import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
  },
  imageUrl: {
    type: String,
  }
})