import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import { response } from "@/utils/response";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();

        const existingVerifiedUserByUsername = await UserModel.findOne({ username, isVerified: true });

        if (existingVerifiedUserByUsername) {
            return response(false, "Username is already taken", 409);
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return response(false, "User already exsits with this email", 409);
            } else {
                const hashPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                existingUserByEmail.save();
            }
        } else {
            const hashPassword = await bcrypt.hash(password, 10);
            const verifyCodeExpiry = new Date();
            verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashPassword,
                verifyCode,
                verifyCodeExpiry,
                isVerified: false,
                isAcceptingMessages: true,
                messages: []
            })

            await newUser.save();
        }

        // Sending email

        const emailResponse = await sendVerificationEmail(username, email, verifyCode);

        if (!emailResponse.success) {
            return response(false, emailResponse.message, 500);
        } else {
            return response(true, "User registered successfully. Please verify your email address.", 201);
        }

    } catch (error) {
        console.error("Error Registering user:", error);

        return response(false, "Error Registering user", 500);
    }
}