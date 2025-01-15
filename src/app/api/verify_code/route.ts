import { Responses } from "@/common/Responses";
import getConnection from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(req: Request) {
  getConnection();
  try {
    const { username, code } = await req.json();
    const codedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: codedUsername });
    if (!user) {
      return Responses({
        success: false,
        message: "Invalid user or email token",
        status: 400,
      });
    }
    const isCodeVerified = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpire) > new Date();
    if (isCodeNotExpired && isCodeVerified) {
      user.isVerified = true;
      await user.save();
      return Responses({
        success: true,
        message: "User verified successfully",
        status: 200,
      });
    } else if (!isCodeNotExpired) {
      return Responses({
        success: false,
        message: "Verification code has expired please sign up again ",
        status: 400,
      });
    } else {
      return Responses({
        success: false,
        message: "Invalid verification code",
        status: 400,
      });
    }
  } catch (err) {
    return Responses({
      success: false,
      message: "An error occurred during verifing  user ",
      status: 500,
    });
  }
}
