import { Document } from "mongoose";

export interface UserModel extends Document {
  name: string;
  email: string;
  password: string;
  profession?: string;
  interests?: string[];
  bio?: string;
  Number?: string;
}
