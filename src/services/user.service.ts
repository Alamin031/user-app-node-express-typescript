import { User } from "../models/user.entity";
import { UserModel } from "../interface/user.interface";
import * as bcrypt from "bcrypt";

export class UserService {
  async getUserProfile(userId: string): Promise<UserModel> {
    try {
      const userProfile = await User.findById(userId);
      if (!userProfile) {
        throw new Error("User profile not found");
      }
      const { _id, name, email, profession, interests, bio, Number } = userProfile;
      return { _id, name, email, profession, interests, bio, Number } as UserModel;
    } catch (error: any) {
      throw new Error("Fetching user profile failed: " + error.message);
    }
  }

  async updateUserProfile(userId: string, data: any): Promise<UserModel | null> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      if (data.password) {
        const salt = await bcrypt.genSalt();
        data.password = await bcrypt.hash(data.password, salt);
      }
      const updatedUserProfile = await User.findByIdAndUpdate(userId, data, {
        new: true,
      });
      return updatedUserProfile;
    } catch (error: any) {
      throw new Error("Updating user profile failed: " + error.message);
    }
  }

  async deleteUser(userId: string): Promise<UserModel | null> {
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      return deletedUser ? deletedUser.toObject() : null;
    } catch (error: any) {
      throw new Error("Deleting user failed: " + error.message);
    }
  }
}

export default new UserService();
