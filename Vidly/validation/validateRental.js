import Joi from "joi";
import { objectId } from "./customJoi.js";

export function validateRental(rental) {
    const schema = Joi.object({
        customerId: objectId.required(),
        movieId: objectId.required()
    });

    return schema.validate(rental, { abortEarly: false });
}

export function validateRentalUpdate(rental) {
    const schema = Joi.object({
        customerId: objectId,
        movieId: objectId
    });

    return schema.validate(rental, { abortEarly: false });
}