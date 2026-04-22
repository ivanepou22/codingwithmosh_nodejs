import Joi from 'joi';
export const validateGenre = (genre) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
    })
    return schema.validate(genre);
}