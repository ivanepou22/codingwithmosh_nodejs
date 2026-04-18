export const validateGenre = (genre) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    })
    return schema.validate(genre);
}