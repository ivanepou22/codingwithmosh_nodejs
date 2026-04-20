import mongoose from "mongoose";
import winston from "winston";
import { configDotenv } from "dotenv";
configDotenv();

winston.add(new winston.transports.File({ filename: 'db.log' }));

export async function dbConnect() {
    let dbUrl = process.env.MONGODB_URL;
    if (process.env.NODE_ENV === 'test') {
        dbUrl = process.env.MONGODB_URL_TEST;
    }
    let dbName = dbUrl.split('/').pop();

    mongoose.connect(dbUrl)
        .then(() => winston.info(`Connected to mongoDb: ${dbName}`))
        .catch((err) => winston.error(`Could not connect to MongoDb: ${dbName}`, err));
};

export const dbDisconnect = async () => {
    try {
        await mongoose.disconnect();
        winston.info('✅ Database disconnected');
    } catch (err) {
        winston.error('❌ Database disconnection failed:', err);
    }
};