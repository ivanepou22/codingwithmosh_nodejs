import Joi from "joi";
import mongoose from "mongoose";
import { Movie } from "../models/movieModel.js";
import { Customer } from "../models/customerModel.js";
import { Rental } from "../models/rentalModel.js";
import { objectId } from "../validation/customJoi.js";
import { asyncMiddleware } from "../middleware/async.js";
import { User } from "../models/userModel.js";

export const getRentals = asyncMiddleware(async (req, res) => {
    const query = req.user.isAdmin ? {} : { 'user._id': req.user._id };
    const rentals = await Rental.find(query).sort('-dateOut');
    res.send(rentals);
});

export const getRental = asyncMiddleware(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Invalid Rental');

    const query = req.user.isAdmin ? { _id: req.params.id } : { _id: req.params.id, 'user._id': req.user._id };
    const rental = await Rental.findOne(query);
    if (!rental) return res.status(404).send('Rental not found');
    res.send(rental);
});

export const deleteRental = asyncMiddleware(async (req, res) => {
    const query = req.user.isAdmin ? { _id: req.params.id } : { _id: req.params.id, 'user._id': req.user._id };
    const rental = await Rental.findOneAndDelete(query);
    if (!rental) return res.status(404).send('Rental not found');
    res.send(rental);
});

export const updateRental = asyncMiddleware(async (req, res) => {
    const { error } = validateRentalUpdate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const updateData = {};
    const query = req.user.isAdmin ? { _id: req.params.id } : { _id: req.params.id, 'user._id': req.user._id };

    if (req.body.dateOut !== undefined) updateData.dateOut = req.body.dateOut;
    if (req.body.rentalFee !== undefined) updateData.rentalFee = req.body.rentalFee;
    if (req.body.dateReturned !== undefined) updateData.dateReturned = req.body.dateReturned;

    if (req.body.customerId) {
        const customer = await Customer.findById(req.body.customerId);
        if (!customer) return res.status(400).send('Invalid customer.');

        updateData.customer = {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
            isGold: customer.isGold
        };
    }

    if (req.body.movieId) {
        const movie = await Movie.findById(req.body.movieId);
        if (!movie) return res.status(400).send('Invalid movie.');

        updateData.movie = {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        };
    }

    const rental = await Rental.findOneAndUpdate(
        query,
        { $set: updateData },
        { returnDocument: 'after', new: true }
    );
    if (!rental) return res.status(404).send('Rental not found');
    res.send(rental);
});

export const createRental = asyncMiddleware(async (req, res) => {
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (!mongoose.Types.ObjectId.isValid(req.body.customerId))
        return res.status(400).send('Invalid customerId');

    if (!mongoose.Types.ObjectId.isValid(req.body.movieId))
        return res.status(400).send('Invalid movieId');

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer.');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid Movie.');

    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).send('Invalid user.');

    if (movie.numberInStock === 0) return res.status(400).send('Movie out of stock.');

    const rental = new Rental({
        user: {
            _id: req.user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        },
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
            isGold: customer.isGold
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    const savedRental = await rental.save();
    movie.numberInStock--;
    await movie.save();

    res.send(savedRental);
});

function validateRental(rental) {
    const schema = Joi.object({
        customerId: objectId.required(),
        movieId: objectId.required()
    });

    return schema.validate(rental, { abortEarly: false });
}

function validateRentalUpdate(rental) {
    const schema = Joi.object({
        customerId: objectId,
        movieId: objectId
    });

    return schema.validate(rental, { abortEarly: false });
}