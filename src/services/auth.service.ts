import { User } from "../models/user.entity";
import bcrypt from 'bcrypt';
import * as jwt from "jsonwebtoken";
import { UserModel } from "../interface/user.interface";
import { PasswordResetToken } from "../models/passwordResetToken.entity";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";

export class AuthService {
  async signup(data: any): Promise<UserModel> {
    try {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, salt);
      const user = new User(data);
console.log(user);
      await user.save();

      return user;
    } catch (error: any) {
      throw new Error("Registration failed: " + (error as Error).message);
    }
  }

  async login(email: string, password: string): Promise<string> {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    return token;
  }

  async initiatePasswordReset(email: string): Promise<void> {
    try {
      const otp = this.generateOTP();

      const expiration = new Date();
      expiration.setMinutes(expiration.getMinutes() + 15);

      const resetToken = new PasswordResetToken({
        email,
        otp,
        expiresAt: expiration,
      });
      await resetToken.save();

      await this.sendOTPEmail(email, otp);
    } catch (error: any) {
      throw new Error("Password reset initiation failed: " + error.message);
    }
  }

  async completePasswordReset(
    email: string,
    otp: string,
    newPassword: string
  ): Promise<void> {
    try {
      const resetToken = await PasswordResetToken.findOne({ email, otp });

      if (!resetToken || resetToken.expiresAt < new Date()) {
        throw new Error("Invalid or expired OTP");
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await User.findOneAndUpdate({ email }, { password: hashedPassword });

      await resetToken.deleteOne();
    } catch (error: any) {
      throw new Error("Password reset failed: " + error.message);
    }
  }

  private generateOTP(): string {
    const otp = otpGenerator.generate(6, { digits: true });
    return otp;
  }

  private async sendOTPEmail(email: string, otp: string): Promise<void> {
    try {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER!,
          pass: process.env.EMAIL_PASS!,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER!,
        to: email,
        subject: "Password Reset OTP",
        text: `
        Dear customer,
        You have requested to reset your password for your account:
        ${email}
        Use the following one-time password (OTP) to complete the process.
        Verification Code: ${otp} 
        Please enter this code on the password reset page to verify your identity.
        This code will expire after a certain duration for security purposes.
        Best regards,`,
      };

      await transporter.sendMail(mailOptions);
    } catch (error: any) {
      throw new Error("Email sending failed: " + error.message);
    }
  }
}
export default new AuthService();
