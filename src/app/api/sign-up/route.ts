import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();

        const existingVerifiedUserByUsername = await UserModel.findOne({ username, isVerified: true });

        if (existingVerifiedUserByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username already taken"
                },
                {
                    status: 400
                }
            )
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User already exsits with this email"
                    },
                    {
                        status: 400
                    }
                )
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
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status: 500 }
            );
        } else {
            return Response.json(
                {
                    success: true,
                    message: "User registered successfully. Please verify your email address.",
                },
                { status: 201 }
            );
        }

    } catch (error) {
        console.error("Error Registering user:", error);

        return Response.json(
            {
                success: false,
                message: "Error Registering user"
            },
            { status: 500 }
        );
    }
}