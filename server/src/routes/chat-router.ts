import { Request, Router } from "express";
import authReq from "../middlewares/auth-types";
import prisma from "../db/db";

const router = Router();

interface postChatReq extends authReq {
  body: {
    group_id?: number;
    message?: string;
  };
}

interface getChatGroupIdReq extends authReq {
  body: {
    group_id?: number;
  };
}

router.get("/:groupId", async (req: authReq, res) => {
  const { groupId } = req.params;
  if (!groupId)
    return res
      .status(400)
      .json({ message: "Server error", error: "Group Id not provided" });

  try {
    const chats = await prisma.chats.findMany({
      where: {
        group: {
          id: Number(groupId),
          GroupMembers: {
            some: {
              user_id: req.user.id,
            },
          },
        },
      },
    });

    return res.status(200).json({ data: chats });
  } catch (error) {
    console.log("==/chat/:groupId==\n", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/post-chat", async (req: postChatReq, res) => {
  try {
    if (!req.body.group_id || !req.body.message)
      return res
        .status(400)
        .json({ message: "Group Id or message not provided" });

    // Check if the person is part of the group
    const isPart = await prisma.groupMembers.findFirst({
      where: {
        user_id: req.user.id,
        group_id: req.body.group_id,
      },
    });
    if (!isPart) {
      console.log("post-chat not part of group");
      return res.status(400).json({ message: "You are not part of the group" });
    }

    await prisma.chats.create({
      data: {
        group_id: req.body.group_id,
        user_id: req.user.id,
        content: req.body.message,
      },
    });

    return res.status(201).json({ success: true, message: "successful" });
  } catch (error) {
    console.log("==post-chat==\n", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
