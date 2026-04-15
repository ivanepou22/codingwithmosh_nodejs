import mongoose from 'mongoose';
export function error(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
}

export function verifyMongooseId(req, res, next) {
    const id = req.params.id || req.body.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid ID');
    }
    next();
}