import { Router } from "express";
import authReq from "../middlewares/auth-types";
import prisma from "../db/db";

const router = Router();

// Get all groups
router.get("/get-all-groups", async (req: authReq, res) => {
  try {
    const groups = await prisma.groups.findMany({
      where: {
        GroupMembers: {
          some: {
            user_id: req.user.id,
          },
        },
      },
      include: {
        GroupMembers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                about: true,
                Tags: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({ data: groups });
  } catch (error) {
    console.log("==/get-all-groups==");
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

interface AddFriendReq extends authReq {
  body: {
    friend_id?: number;
  };
}

router.post("/add-friend", async (req: AddFriendReq, res) => {
  const { friend_id } = req.body;
  if (!friend_id) return res.status(400).json({ message: "Invalid request" });

  try {
    // Check if user exists
    const friend = await prisma.users.findFirst({
      where: { id: friend_id },
      select: { id: true, name: true },
    });
    if (!friend) return res.status(404).json({ message: "User not found" });

    // Check if already friends
    const isFriend = await prisma.friends.findFirst({
      where: {
        user_id: req.user.id,
        friend_id: friend_id,
      },
    });
    if (isFriend) return res.status(400).json({ message: "Already friends" });

    // Add to group
    const NewGroup = await prisma.groups.create({
      data: {
        GroupMembers: {
          create: [
            { user: { connect: { id: req.user.id } } },
            { user: { connect: { id: friend_id } } },
          ],
        },
        name: `${req.user.name} ${friend.name}`,
      },
      include: {
        GroupMembers: {
          include: {
            user: {
              select: {
                Tags: true,
              },
            },
          },
        },
      },
    });

    // Add friend
    await prisma.friends.create({
      data: {
        user: { connect: { id: req.user.id } },
        friend: { connect: { id: friend_id } },
        group: { connect: { id: NewGroup.id } },
      },
    });

    await prisma.friends.create({
      data: {
        user: { connect: { id: friend_id } },
        friend: { connect: { id: req.user.id } },
        group: { connect: { id: NewGroup.id } },
      },
    });

    // return success
    res
      .status(200)
      .json({ data: NewGroup, message: "Friend added successfully" });
  } catch (error) {
    console.log("==/add-friend==");
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
