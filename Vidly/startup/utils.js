import { logger } from "./logging.js";

export const logError = async (req, error) => {
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