import { User, getServerSession } from "next-auth";
import UserModel from "@/model/User";
import getConnection from "@/lib/dbConnect";
import { Responses } from "@/common/Responses";

import mongoose, { Mongoose } from "mongoose";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(
  req: Request,
  { params }: { params: { messageid: string } }
) {
  const messageid = params.messageid;
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
    const updatedMessages  = await UserModel.updateOne(
      {_id: user._id},
    {  $pull : {messages : {
        _id: messageid,
      }}}
    )
    if (updatedMessages.modifiedCount === 0) {
         return Responses({
          success: false,
          message: "Message not found",
          status: 404,
        });
    }
    return Responses({
      success: true,
      message: "Message deleted successfully",
      status: 200,
    });


  } catch (error) {
    return Responses({
      success: false,
      message: "Error in retrieving user's messages",
      status: 500,
    });
  }
}
