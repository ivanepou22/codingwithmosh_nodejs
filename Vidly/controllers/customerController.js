import Joi from "joi";
import mongoose from "mongoose";
import _ from "lodash";
import { Customer } from "../models/customerModel.js";
import { User } from "../models/userModel.js";
import { asyncMiddleware } from "../middleware/async.js";
import { validateCustomer } from "../validation/validateCustomer.js";

export const getCustomers = asyncMiddleware(async (req, res) => {
    const query = req.user.isAdmin ? {} : { 'user._id': req.user._id };
    const customers = await Customer.find(query).sort('name');
    res.send(customers);
});

export const getCustomer = asyncMiddleware(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.user._id))
        return res.status(400).send('Invalid userId');

    const query = req.user.isAdmin ? { _id: req.params.id } : { _id: req.params.id, 'user._id': req.user._id };
    const customer = await Customer.findOne(query);
    if (!customer) return res.status(404).send('Customer not found');
    res.send(customer);
});

export const deleteCustomer = asyncMiddleware(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.user._id))
        return res.status(400).send('Invalid user');

    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Invalid customer');

    const query = req.user.isAdmin ? { _id: req.params.id } : { _id: req.params.id, 'user._id': req.user._id };
    const customer = await Customer.findOneAndDelete(query);
    if (!customer) return res.status(404).send('Customer not found');
    res.send(customer);
});

export const updateCustomer = asyncMiddleware(async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (!mongoose.Types.ObjectId.isValid(req.user._id))
        return res.status(400).send('Invalid user');

    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Invalid customer');

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
});

export const createCustomer = asyncMiddleware(async (req, res) => {
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

    const savedCustomer = await customer.save();
    res.send(_.pick(savedCustomer, ['_id', 'name', 'phone', 'isGold', 'user']));
});
