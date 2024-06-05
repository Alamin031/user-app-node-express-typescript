import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.entity";
import { UserModel } from "../interface/user.interface";

export const SECRET_KEY: Secret = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC8k3x3Wi9V3kMkYu9tjDaSRD2cBjOgp3FQU/Gndlced9WsaVNx3lgkbbS47sPpFMdQVSgmGbRqhaj9vUrD56+QOMn5HuxeAp5VMwwD$";

declare global {
  namespace Express {
    interface Request {
      user?: UserModel;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log(token);
    if (!token) {
      throw new Error("Please authenticate");
    }
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
    const user = await User.findOne({
      _id: decoded.userId,
    });
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user.toObject(); // Convert user to plain object
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).send({ error: "Invalid token" });
    } else {
      res.status(401).send({ error: "Please authenticate?" });
    }
  }
};
