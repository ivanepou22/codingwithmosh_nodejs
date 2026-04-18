import { logger } from "../startup/logging.js";

export function asyncMiddleware(handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        } catch (error) {
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
            next(error);
        }
    }
}