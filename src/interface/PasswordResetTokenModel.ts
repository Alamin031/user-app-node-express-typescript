import { Document } from 'mongoose';


export interface PasswordResetTokenModel extends Document {
    email: string;
    otp: string;
    expiresAt: Date;
  }