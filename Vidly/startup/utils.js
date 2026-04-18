import mongoose from "mongoose";
import { logger } from "./logging.js";
import { User } from "../models/userModel.js";

export const logError = async (req, error, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.user._id))
        return res.status(400).send('Invalid userId');
    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).send('Invalid user');

    req.user = {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
    };

    await logger(
        {
            messageString: error.message,
            additionalInfo: {
                error: error,
                request: {
                    user: req.user,
                    rawHeaders: req.rawHeaders,
                    reqheader: req.headers,
                    reqBody: req.body,
                    reqParam: req.params,
                    reqQuery: req.query,
                }
            },
            type: 'error',
        }
    )
};