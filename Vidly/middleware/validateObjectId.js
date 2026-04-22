import mongoose from 'mongoose';
import winston from 'winston';
import { logError } from '../startup/utils.js';

export async function validateObjectId(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        winston.warn('Invalid id provided');
        return res.status(404).send('Invalid id provided');
    }
    next();
}