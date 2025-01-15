import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import UserModel from "@/model/User";
import getConnection from "@/lib/dbConnect";
import { Responses } from "@/common/Responses";

export async function POST(req: Request) {
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
  const { acceptMessages } = await req.json();

  try {
    const updatedUserById = UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage: acceptMessages,
      },
      { new: true }
    );
    if (!updatedUserById) {
      return Responses({
        success: false,
        message: "User not found",
        status: 401,
      });
    }
    return Responses({
      success: true,
      message: "User messages status updated successfully",
      status: 200,
    });
  } catch (error) {
    return Responses({
      success: false,
      message: "Error in updating user messages status ",
      status: 500,
    });
  }
}

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
  try {
    const userById = await UserModel.findById(userId);
    if (!userById) {
      return Responses({
        success: false,
        message: "User not found",
        status: 401,
      });
    }
    return Response.json({
      success: true,
      message: "User messages status retrieved successfully",

      isAcceptingMessage: userById.isAcceptingMessage,

      status: 200,
    });
  } catch (error) {
    return Responses({
      success: false,
      message: "Error in retrieving user messages status ",
      status: 500,
    });
  }
}
