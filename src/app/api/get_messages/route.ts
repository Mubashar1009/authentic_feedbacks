import { User, getServerSession } from "next-auth";
import UserModel from "@/model/User";
import getConnection from "@/lib/dbConnect";
import { Responses } from "@/common/Responses";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose, { Mongoose } from "mongoose";

export async function GET(req: Request, res: Response) {
  await getConnection();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return Responses({
      success: false,
      message: "User not authenticated",
      status: 401,
    });
  }
  const userId = user._id;
  const userIdUpdated = new mongoose.Types.ObjectId(userId);
  try {
    const user = await UserModel.aggregate([
      {
        $match: { _id: userIdUpdated },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: { "messages.createdAt": -1 },
      },
      {
        $group: {
          _id: userIdUpdated,
          messages: { $push: "$messages" },
        },
      },
    ]);
    if (!user || user.length === 0) {
      return Responses({
        success: false,
        message: "No user found ",
        status: 401,
      });
    }
    return Response.json(
      {
        success: true,
        message: "User's messages retrieved successfully",
        messages: user[0].messages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Responses({
      success: false,
      message: "Error in retrieving user's messages",
      status: 500,
    });
  }
}
