import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { response } from "@/utils/response";

const UsernameQuerySchema = z.object(
    {
        username: usernameValidation
    }
);

export async function GET(request: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const queryParams = {
            username: searchParams.get('username')
        }

        const result = UsernameQuerySchema.safeParse(queryParams);

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];

            const message = usernameErrors?.length > 0 ? usernameErrors.join(', ') : "Invalid query parameters";
            return response(false, message, 500);
        }

        const { username } = result.data;

        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });

        if (existingVerifiedUser) {
            //console.log(existingVerifiedUser);
            return response(false, "Username is already taken", 409);
        }
        return response(false, "Username is unique", 200);

    } catch (error) {
        console.error("Error checking username:", error)
        return response(false, "Error checking username", 500);
    }
}