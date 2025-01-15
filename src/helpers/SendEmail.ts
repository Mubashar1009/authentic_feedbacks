import { resend } from "@/lib/Resend";
import EmailTemplate from "@/emails/EmailTemplate";
import { ApiResponse } from "@/types/Response";

export const sendVerificationEmail = async (
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Verification email",
      react: EmailTemplate({ username, otp: verifyCode }),
    });

    return { success: true, message: "Verification email sent successfully" };
  } catch (error) {
    return { success: false, message: "Failed to send verification email" };
  }
};
