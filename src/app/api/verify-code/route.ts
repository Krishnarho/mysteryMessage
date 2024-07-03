import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User";
import { response } from "@/utils/response";


export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, code } = await request.json();
        const decoderUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decoderUsername });

        if (!user) {
            return response(false, "User not found", 404);
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            // Update the user's verification status
            user.isVerified = true;
            await user.save();

            return response(true, "Account verified successfully", 200);
        } else if (!isCodeNotExpired) {
            // Code has expired
            return response(false, "Verification code has expired. Please sign up again to get a new code.", 400);
        } else {
            // Code is incorrect
            return response(false, "Incorrect verification code", 400);
        }
    } catch (error) {
        console.error("Error checking verify code:", error)
        return response(false, "Error checking verify code", 500);
    }
}