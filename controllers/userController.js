import Joi from "joi";
import bcrypt from "bcrypt";
import _ from "lodash";
import { User } from "../models/userModel.js";

export const getUsers = async (_req, res) => {
    try {
        const users = await User.find().sort('name').select('-password');
        res.send(users);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).send('User not found');
        res.send(user);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password, -isAdmin');
        if (!user) return res.status(404).send('User not found');
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndRemove(req.params.id);
        if (!user) return res.status(404).send('User not found');
        res.send(user);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

export const createUser = async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if the user already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already exists');

    //hash the password before saving to the database
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    user = new User(_.pick(req.body, ['name', 'email', 'password', 'isAdmin']));
    try {
        user = await user.save();

        //generate a JWT token and return it to the client
        const token = user.generateAuthToken();
        res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
    }
    catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

export const updateUser = async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).send('User not found');
        res.send(user);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

export const validateUser = (user) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required(),
        isAdmin: Joi.boolean()
    });
    return schema.validate(user);
}