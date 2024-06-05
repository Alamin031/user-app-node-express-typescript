import express from "express";
import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./src/routes/auth.route";
import userRouter from "./src/routes/user.route";
import { auth } from "./src/middleware/auth";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const connectdb = async () => {
  const MONGODB_URI = process.env.MONGODB_URI || "";

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log("Connected to Distribution API Database - Initial Connection");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
connectdb();

app.get("/", (req, res) => {
  res.send("Hello, Express with TypeScript!");
});

app.use("/api", authRouter);
app.use("/api/users", auth, userRouter);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
