import mongoose, { Document, Schema } from 'mongoose';
import { UserModel } from '../interface/user.interface';

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profession: {
    type: String,
    required: false,
  },
  interests: {
    type: [String],
    required: false,
  },
  bio: {
    type: String,
    maxlength: 50,
    required: false,
  },
});

export const User = mongoose.model<UserModel & Document>('User', userSchema);
