import Joi from 'joi';
import bcrypt from 'bcrypt';
import { User } from '../models/userModel.js';
import { asyncMiddleware } from '../middleware/async.js';
import dotenv from 'dotenv';
dotenv.config();

export const authenticate = asyncMiddleware(async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if the user with the given email exists
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password');

    //check if the password is correct
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(400).send('Invalid email or password');

    //generate a JWT token and return it to the client
    const token = user.generateAuthToken();

    res.status(200).send({ token });
});

const validateUser = (req) => {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(req);
}