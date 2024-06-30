import dbConnect from "@/lib/dbConnect";
import { auth } from "@/auth";
import { response } from "@/utils/response";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) { // updating isAcceptingMessage status
    dbConnect();

    const session = await auth(); // If not working check this code
    const user: User = session?.user;

    if (!session || !user) {
        return response(false, "Not aunthenticated", 401);
    }

    const { acceptMessagesStatus } = await request.json();
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            user._id,
            { isAcceptingMessages: acceptMessagesStatus },
            { new: true },
        );
        if (!updatedUser) {
            return response(true, "Unable to find user to update message acceptance status", 404)
        }

        return Response.json(
            {
                success: true,
                message: 'Message acceptance status updated successfully',
                updatedUser,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error in updating user acceptance status", error);
        return response(false, "Error in updating user acceptance status", 500)
    }

}

export async function GET(request: Request) { // checking if user is accepting message
    dbConnect();

    const session = await auth(); // If not working check this code
    const user = session?.user;

    if (!session || !user) {
        return response(false, "Not aunthenticated", 401);
    }

    try {
        const foundUser = await UserModel.findById(user._id);

        if (!foundUser) {
            return response(false, "User not found", 404);
        }
        return response(true, foundUser.isAcceptingMessages, 200);
    } catch (error) {
        console.error("Error in retrieving message acceptance update status", error);
        return response(false, "Error in retrieving message acceptance update status", 500)
    }
}