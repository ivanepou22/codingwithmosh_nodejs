import Joi from "joi";
import mongoose from "mongoose";
import _ from "lodash";
import { Customer } from "../models/customerModel.js";
import { User } from "../models/userModel.js";

export const getCustomers = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.user._id))
        return res.status(400).send('Invalid userId');

    try {
        const query = req.user.isAdmin ? {} : { 'user._id': req.user._id };
        const customers = await Customer.find(query).sort('name');
        res.send(customers);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

export const getCustomer = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.user._id))
        return res.status(400).send('Invalid userId');

    try {
        const query = req.user.isAdmin ? { _id: req.params.id } : { _id: req.params.id, 'user._id': req.user._id };
        const customer = await Customer.findOne(query);
        if (!customer) return res.status(404).send('Customer not found');
        res.send(customer);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

export const deleteCustomer = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.user._id))
        return res.status(400).send('Invalid user');

    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Invalid customer');

    try {
        const query = req.user.isAdmin ? { _id: req.params.id } : { _id: req.params.id, 'user._id': req.user._id };
        const customer = await Customer.findOneAndDelete(query);
        if (!customer) return res.status(404).send('Customer not found');
        res.send(customer);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

export const updateCustomer = async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (!mongoose.Types.ObjectId.isValid(req.user._id))
        return res.status(400).send('Invalid user');

    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Invalid customer');

    try {
        const query = req.user.isAdmin ? { _id: req.params.id } : { _id: req.params.id, 'user._id': req.user._id };
        const customer = await Customer.findOneAndUpdate(query, {
            $set: {
                name: req.body.name,
                phone: req.body.phone,
                isGold: req.body.isGold
            }
        }, { returnDocument: 'after' });
        if (!customer) return res.status(404).send('Customer not found');
        res.send(customer);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

export const createCustomer = async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (!mongoose.Types.ObjectId.isValid(req.user._id))
        return res.status(400).send('Invalid userId');
    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).send('Invalid user');

    const customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email
        }
    })

    try {
        const savedCustomer = await customer.save();
        res.send(_.pick(savedCustomer, ['_id', 'name', 'phone', 'isGold', 'user']));
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

export const validateCustomer = (customer) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(255).required(),
        phone: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean()
    })
    return schema.validate(customer);
}
