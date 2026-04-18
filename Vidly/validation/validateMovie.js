export const validateMovie = (movie) => {
    const schema = Joi.object({
        title: Joi.string().min(2).required(),
        genreId: Joi.string().required(),
        numberInStock: Joi.number().min(0).default(0),
        dailyRentalRate: Joi.number().min(0).default(0)
    })
    return schema.validate(movie);
}

export const validateUpdateMovie = (movie) => {
    const schema = Joi.object({
        title: Joi.string().min(2),
        genreId: Joi.string(),
        numberInStock: Joi.number(),
        dailyRentalRate: Joi.number()
    })
    return schema.validate(movie);
}