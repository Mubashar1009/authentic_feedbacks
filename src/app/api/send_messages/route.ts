import UserModel from "@/model/User";
import getConnection from "@/lib/dbConnect";
import { Message } from "@/model/User";
import { Responses } from "@/common/Responses";

export async function POST(request: Request) {
  await getConnection();
  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({
      username,
    });
    if (!user) {
      return Responses({
        success: false,
        message: "User not found",
        status: 404,
      });
    }
    if (!user.isAcceptingMessage) {
      return Responses({
        success: false,
        message: "User is not accepting messages",
        status: 400,
      });
    }
    const newMessage = { message: content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();
    return Responses({
      success: true,
      message: "User's message updated successfully",
      status: 200,
    });
  } catch (error) {
    return Responses({
      success: false,
      message: "Error in updating user's message",
      status: 500,
    });
  }
  // const { message } = await request.json();
  // const user = await UserModel.findByIdAndUpdate(
  //   request.user._id,
  //   { $push: { messages: { message, createdAt: new Date() } } },
  //   { new: true }
  // );
  // return user;
}
