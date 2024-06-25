import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail(
    username: string,
    email: string,
    verifyCode: string,
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'dev@sirsainfotech.com',
            to: email,
            subject: 'Mystery Message Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });

        return { success: true, message: 'Verification email sent successfully.' };
    } catch (error) {
        console.error('sendVerificationEmail::Error sending verification email: ', error);

        return { success: false, message: "Failed to send verification email." }
    }
}