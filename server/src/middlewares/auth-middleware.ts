import { Request, Response } from "express";
import prisma from "../db/db";
import jwt from "jsonwebtoken";
import authReq from "./auth-types";

const secret = process.env.SECRET || "";

const authMiddleware = async (req: authReq, res: Response, next: Function) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      console.log("==authMiddleware==\n No token");
      return res.status(401).json({ message: "Unauthorized", loggedIn: false });
    }

    const decoded = jwt.verify(token, secret) as { id: number };
    if (!decoded) {
      console.log("==authMiddleware==\n Invalid token");
      return res.status(401).json({ message: "Unauthorized", loggedIn: false });
    }

    const user = await prisma.users.findUnique({ where: { id: decoded.id } });
    if (!user) {
      console.log("==authMiddleware==\n Invalid token");
      return res.status(401).json({ message: "Unauthorized", loggedIn: false });
    }

    req.user = { ...user, password: "" };
    next();
  } catch (error) {
    console.log("==authMiddleware==\n", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default authMiddleware;
