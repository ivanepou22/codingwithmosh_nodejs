import mongoose from 'mongoose';
import winston from 'winston';
import { logError } from '../startup/utils.js';

export async function validateMongooseObjectId(req, res, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        winston.warn('Invalid id provided');
        // await logError(req, new Error('Invalid id provided'), res);
        return res.status(400).send('Invalid id provided');
    }
}