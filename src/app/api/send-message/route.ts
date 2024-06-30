import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";
import { response } from "@/utils/response";

export async function POST(request: Request) {
    await dbConnect();

    const { username, content } = await request.json();

    try {
        const user = await UserModel.findOne({ username }).exec();

        if (!user) {
            return response(false, "User not found", 404);
        }

        if (!user?.isAcceptingMessages) {
            return response(false, "User is not accepting message", 403);
        }

        const newMsg = { content, createdAt: new Date() };

        user?.messages.push(newMsg as Message);
        await user.save();

        return response(true, "Message successfully added", 201)

    } catch (error) {
        console.error("Error adding message", error);
        return response(false, "Error adding message", 4);
    }
}