import { User } from "@/model/User";

export function response(success: Boolean, message: string | string[] | boolean, status: number) {
    return Response.json(
        {
            success,
            message,
        },
        { status }
    );
}