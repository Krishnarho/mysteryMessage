import mongoose from "mongoose";

type ConnectionObjext = {
    isConnected?: number;
};

let connection: ConnectionObjext = {};

export default async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to db");
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {});

        connection.isConnected = db.connections[0].readyState;

        console.log('Database connected successfully');
    } catch (err) {
        console.log("Database connection failed: ", err);

        process.exit(1);
    }
}