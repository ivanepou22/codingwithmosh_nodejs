import winston from 'winston';
import 'winston-mongodb';
import mongoose from 'mongoose';
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

let options = {
    db: process.env.MONGODB_URL,
    Collection: 'logs',
    capped: false,
    expireAfterSeconds: 2592000,
    leaveConnectionOpen: false,
    storeHost: false,
    metakey: 'additionalInfo',
}

const log = winston.createLogger({
    transports: [
        new winston.transports.MongoDB(options)
    ]
})

export async function logger({ messageString = '', additionalInfo = { error: null, request: null }, type = 'error' }) {
    try {
        log[type]({
            message: messageString,
            additionalInfo: {
                error: additionalInfo?.error,
                request: additionalInfo?.request
                    ? {
                        user: additionalInfo?.request?.user,
                        rawHeaders: additionalInfo?.request?.rawHeaders,
                        reqheader: additionalInfo?.request?.headers,
                        reqBody: additionalInfo?.request?.body,
                        reqParam: additionalInfo?.request?.params,
                        reqQuery: additionalInfo?.request?.query,
                    }
                    : null
            },
        });
    } catch (err) {
        log.error({
            message: services.loggerService,
            additionalInfo: {
                error: err,
                request: additionalInfo?.request
                    ? {
                        rawHeaders: additionalInfo?.request?.rawHeaders,
                        reqheader: additionalInfo?.request?.headers,
                        reqBody: additionalInfo?.request?.body,
                        reqParam: additionalInfo?.request?.params,
                        reqQuery: additionalInfo?.request?.query,
                    }
                    : null
            }
        })
    }
}