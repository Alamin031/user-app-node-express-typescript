import mongoose, { Document, Schema } from 'mongoose';
import { PasswordResetTokenModel } from '../interface/PasswordResetTokenModel';


const passwordResetTokenSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

export const PasswordResetToken = mongoose.model<PasswordResetTokenModel>(
  'PasswordResetToken',
  passwordResetTokenSchema
);
