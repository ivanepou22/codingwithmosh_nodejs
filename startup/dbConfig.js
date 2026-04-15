import mongoose from "mongoose";
import winston from "winston";
import { configDotenv } from "dotenv";
configDotenv();

winston.add(new winston.transports.File({ filename: 'db.log' }));

export async function dbConnect() {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => winston.info('Connected to mongoDb...'))
        .catch((err) => winston.error('Could not connect to MongoDb..', err));
};