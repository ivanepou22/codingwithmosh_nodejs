import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

export async function dbConnect() {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => console.log('Connected to mongoDb...'))
        .catch((err) => console.log('Could not connect to MongoDb..', err));
};