'use server'

import { signIn, signOut } from "@/auth";
import UserModel from "@/model/User";
import { DEFAULT_LOGIN_REDIRECT } from "@/routesAnt";
import { SignInSchema } from "@/schemas/signInSchema";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod";

// export async function doSocialLogin(data:z.infer<typeof SignInSchema>) {
//     const action = formData.get('action');
//     await signIn(action, { redirectTo: "/store" });
// }

export async function doCredentialLogin(data: z.infer<typeof SignInSchema>) {

    const existingUser = await UserModel.findOne({
        $or: [
            { email: data.identifier },
            { username: data.identifier }
        ]
    }).lean();
    if (existingUser === null) {
        return { error: "User not found." }
    }

    if (existingUser && !existingUser.isVerified) {
        redirect(`/verify/${existingUser.username}`);
    }

    try {
        await signIn("credentials", {
            redirectTo: DEFAULT_LOGIN_REDIRECT,
            identifier: data.identifier,
            password: data.password,
        });

    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin": { //This works in beta.18 only. Check updates on 19
                    return { error: "Invalid credentials!" }
                }
                default: {
                    return { error: "Something went wrong" }
                }
            }
        }
        throw error;
    }
}

export async function doLogout() {
    await signOut({ redirectTo: "/" })
}