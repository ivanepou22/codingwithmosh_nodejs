import { logError } from "../startup/utils.js";

export function asyncMiddleware(handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        } catch (error) {
            await logError(req, error, res);
            next(error);
        }
    }
}