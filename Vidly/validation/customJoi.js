import Joi from "joi";

export const objectId = Joi.string()
    .hex()
    .length(24)
    .messages({
        "string.hex": "customerId / movieId must be a valid hexadecimal string",
        "string.length": "customerId / movieId must be 24 characters long",
        "any.required": "customerId / movieId is required"
    });
