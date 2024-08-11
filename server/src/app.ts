import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import initializeSocketConnection from "./socket";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// Routes here
import { authRouter, userRouter, groupRouter, chatRouter } from "./routes";
import authMiddleware from "./middlewares/auth-middleware";

app.use("/auth", authRouter);
app.use("/user", authMiddleware, userRouter);
app.use("/group", authMiddleware, groupRouter);
app.use("/chat", authMiddleware, chatRouter);

// Routes
app.get("/", (req, res) => {
  res.send("Server running fine");
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port localhost:${PORT}/`);
});

initializeSocketConnection(server);
