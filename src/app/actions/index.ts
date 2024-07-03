'use server'

import { signIn, signOut } from "@/auth";
import { SignInSchema } from "@/schemas/signInSchema";
import { AuthError } from "next-auth";
import { z } from "zod";

// export async function doSocialLogin(data:z.infer<typeof SignInSchema>) {
//     const action = formData.get('action');
//     await signIn(action, { redirectTo: "/store" });
// }

export async function doCredentialLogin(data: z.infer<typeof SignInSchema>) {
    //const toast = useToast();
    try {
        const response = await signIn("credentials", {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        });

        return response;
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin": {
                    return { error: "Invalid credentials" }
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