import { Responses } from "@/common/Responses";
import getConnection from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";

const userNameSchema = z.object({
  username: z
    .string()
    .min(3, "User name must be at least 3 characters")
    .max(20, "User name must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "User name must not have special characters"),
});

export async function Get(request: Request) {
  await getConnection();

  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    const schema = userNameSchema.safeParse({ username });
    if (!schema.success) {
      const error = schema.error.format().username?._errors || [];
      return Responses({
        success: false,
        message: error.length > 0 ? error.join(", ") : "Invalid parameters",
        status: 400,
      });
    }

    const { username: validUsername } = schema.data;
    const user = await UserModel.findOne({
      username: validUsername,
      isVerified: true,
    });

    if (user) {
      return Responses({
        success: false,
        message: "This user name is already registered",
        status: 400,
      });
    }

    return Responses({
      success: true,
      message: "User name is unique",
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Invalid username" }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
