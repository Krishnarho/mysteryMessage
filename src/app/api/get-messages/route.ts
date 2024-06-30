import dbConnect from "@/lib/dbConnect";
import { auth } from "@/auth";
import { response } from "@/utils/response";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
    dbConnect();

    const session = await auth(); // If not working check this code
    const _user: User = session?.user;

    if (!session || !_user) {
        return response(false, "Not aunthenticated", 401);
    }

    const userId = new mongoose.Types.ObjectId(_user._id);

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: "$messages" },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } },
        ]).exec();

        if (!user || user.length === 0) {
            return response(false, "User not found", 404);
        }

        return response(true, user[0].messages, 200);
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return response(false, "An unexpected error occurred", 500);
    }
}