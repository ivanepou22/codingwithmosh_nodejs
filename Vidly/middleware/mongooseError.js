import mongoose from 'mongoose';
import winston from 'winston';
import { logError } from '../startup/utils.js';

export async function validateMongooseObjectId(req, res, err) {
    const id = req.params.id || req.body.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        winston.warn('Invalid ID provided');
        await logError(req, err, res);
        return res.status(400).send('Invalid ID');
    }
}