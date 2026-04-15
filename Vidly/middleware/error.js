import mongoose from 'mongoose';
import winston from 'winston';
export function error(err, req, res, next) {
    winston.error(err.message, err);
    //loging level
    //error, warn, info, verbose, debug, silly
    res.status(500).send('Internal Server Error');
}

export function verifyMongooseId(err, req, res, next) {
    console.log('Here we go!');
    const id = req.params.id || req.body.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        winston.warn('Invalid ID provided');
        return res.status(400).send('Invalid ID');
    }
    next();
}