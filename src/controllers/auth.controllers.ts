import { Request, Response } from "express";
import authService from "../services/auth.service";
import { User } from "../models/user.entity";

//signup route

// Sign-up route
export const signup = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const newUser = await authService.signup(data);

    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Login route
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token = await authService.login(email, password);
    console.log(token);
    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
};

// Forgot password route
  
export const forgotPassword = async(req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    await authService.initiatePasswordReset(email);

    res.status(200).json({ message: 'Password reset initiated. Check your email for OTP.' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}


export const  resetPassword= async(req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, newPassword } = req.body;

    await authService.completePasswordReset(email, otp, newPassword);

    res.status(200).json({ message: 'Password reset successful.' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
  
