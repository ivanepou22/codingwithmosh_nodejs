import mongoose from "mongoose";

const requestInfoSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.Mixed },
    rawHeaders: { type: [String] },
    reqheader: { type: mongoose.Schema.Types.Mixed },
    reqBody: { type: mongoose.Schema.Types.Mixed },
    reqParam: { type: mongoose.Schema.Types.Mixed },
    reqQuery: { type: mongoose.Schema.Types.Mixed }
}, { _id: false });

const additionalInfoSchema = new mongoose.Schema({
    error: { type: mongoose.Schema.Types.Mixed },
    request: { type: requestInfoSchema }
}, { _id: false });

const errorLogSchema = new mongoose.Schema({
    message: { type: String, required: true },
    level: {
        type: String,
        required: true,
        enum: ['error', 'warn', 'info', 'verbose', 'debug', 'silly']
    },
    timestamp: { type: Date, default: Date.now },
    additionalInfo: { type: additionalInfoSchema }
}, {
    collection: 'logs',
    timestamps: false
});

export const ErrorLog = mongoose.model('Log', errorLogSchema);
