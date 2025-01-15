import getConnection from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/SendEmail";
import { Responses } from "@/common/Responses";

export async function POST(req: Request) {
  console.log("POST");
  await getConnection();
  const { email, username, password } = await req.json();

  try {
    const existingUserWithUserName = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserWithUserName) {
      return Responses({
        success: false,
        message: "User already exists with this name ",
        status: 400,
      });
    }
    const existingUserWithEmail = await UserModel.findOne({ email });
    const verifyCode = Math.random().toString(36).substr(2, 10);
    if (existingUserWithEmail) {
      if (existingUserWithEmail.isVerified) {
        return Responses({
          success: false,
          message: "User already exists with this email ",
          status: 400,
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUserWithEmail.password = hashedPassword;
      existingUserWithEmail.verifyCode = verifyCode;
      existingUserWithEmail.verifyCodeExpire = new Date(
        Date.now() + 60 * 60 * 1000
      );
      await existingUserWithEmail.save();
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await UserModel.create({
        username,
        email,
        password: hashedPassword,
        verifyCode: Math.random().toString(36).substr(2, 10),
        verifyCodeExpire: new Date(Date.now() + 60 * 60 * 1000),
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.success) {
      return Responses({
        success: false,
        message: emailResponse.message,
        status: 500,
      });
    }

    return Responses({
      success: true,
      message: "User Register Successfully.Please verify Your Email",
      status: 200,
    });
  } catch (error) {
    return Responses({
      success: false,
      message: "Error in Registing  User ",
      status: 500,
    });
  }
}
