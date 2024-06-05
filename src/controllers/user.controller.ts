import { Request, Response } from "express";
import UserService from "../services/user.service";

// Show profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const userProfile = await UserService.getUserProfile(userId);

    if (!userProfile) {
      return res.status(404).json({ error: "User profile not found" });
    }

    res.status(200).json(userProfile);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Update user profile route
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    const updatedUserProfile = await UserService.updateUserProfile(userId, data);
    res.status(200).json(updatedUserProfile);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};

// Delete user route
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const deletedUser = await UserService.deleteUser(userId);
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};
