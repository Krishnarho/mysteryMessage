import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials: any): Promise<any> => {
                await dbConnect();

                try {
                    const userLogged = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    }).lean();
                    //console.log("authJs:: ", user);
                    if (!userLogged) {
                        return null
                    }

                    if (!userLogged.isVerified) {
                        throw Error('Please verify your account first'); // TODO
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, userLogged.password); // form data first and the db data next. Else wont work

                    if (isPasswordCorrect) {
                        return userLogged;
                    }

                    return null
                } catch (err: any) {
                    throw new Error(err.message);
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            //console.log("Token: ", token);
            if (user) {
                token._id = user._id?.toString(); // Convert ObjectId to string
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session;
        },
    },
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: '/sign-in',
    },
})