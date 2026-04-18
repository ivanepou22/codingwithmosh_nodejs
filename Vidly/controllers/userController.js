import Joi from "joi";
import bcrypt from "bcrypt";
import _ from "lodash";
import { User } from "../models/userModel.js";
import { asyncMiddleware } from "../middleware/async.js";

export const getUsers = asyncMiddleware(async (_req, res) => {
    const users = await User.find().sort('name').select('-password');
    res.send(users);
});

export const getUser = asyncMiddleware(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).send('User not found');
    res.send(user);
});

export const getCurrentUser = asyncMiddleware(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password, -isAdmin');
    if (!user) return res.status(404).send('User not found');
    res.status(200).send(user);
});

export const deleteUser = asyncMiddleware(async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.send(user);
});

export const createUser = asyncMiddleware(async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if the user already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already exists');

    //hash the password before saving to the database
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    user = new User(_.pick(req.body, ['name', 'email', 'password', 'isAdmin']));
    user = await user.save();

    //generate a JWT token and return it to the client
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

export const updateUser = asyncMiddleware(async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).send('User not found');
    res.send(user);
});

export const validateUser = (user) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required(),
        isAdmin: Joi.boolean()
    });
    return schema.validate(user);
}