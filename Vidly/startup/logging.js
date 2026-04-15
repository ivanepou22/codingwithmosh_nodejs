import winston from 'winston';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

export async function logging() {
    // Handle uncaught exceptions
    winston.exceptions.handle(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.File({ filename: 'uncaughtExceptions.log' })
    );
    // Handle unhandled promise rejections
    winston.rejections.handle(
        new winston.transports.File({ filename: 'unhandledRejections.log' })
    );
    winston.add(new winston.transports.File({ filename: 'logfile.log' }));
    // winston.add(new winston.transports.MongoDB({ db: process.env.MONGODB_URL }));

}