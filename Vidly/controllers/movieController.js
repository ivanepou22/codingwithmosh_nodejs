import Joi from "joi";
import { Movie } from "../models/movieModel.js";
import { Genre } from "../models/genreModel.js";
import mongoose from "mongoose";
import { User } from "../models/userModel.js";
import { asyncMiddleware } from "../middleware/async.js";
import { validateMovie, validateUpdateMovie } from "../validation/validateMovie.js";

export const getMovies = asyncMiddleware(async (req, res) => {
    const query = req.user.isAdmin ? {} : { 'user._id': req.user._id };
    const movies = await Movie.find(query).sort('title');
    res.send(movies);
});

export const getMovie = asyncMiddleware(async (req, res) => {
    const query = req.user.isAdmin ? { _id: req.params.id } : { _id: req.params.id, 'user._id': req.user._id };
    const movie = await Movie.findOne(query);
    if (!movie) return res.status(404).send('Movie not found');
    res.send(movie);
});

export const deleteMovie = asyncMiddleware(async (req, res) => {
    const query = req.user.isAdmin ? { _id: req.params.id } : { _id: req.params.id, 'user._id': req.user._id };
    const movie = await Movie.findOneAndDelete(query);
    if (!movie) return res.status(404).send('Movie not found');
    res.send(movie);
});

export const updateMovie = asyncMiddleware(async (req, res) => {
    const { error } = validateUpdateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const updateData = {};

    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.numberInStock !== undefined) updateData.numberInStock = req.body.numberInStock;
    if (req.body.dailyRentalRate !== undefined) updateData.dailyRentalRate = req.body.dailyRentalRate;

    if (req.body.genreId) {
        const genre = await Genre.findById(req.body.genreId);
        if (!genre) return res.status(400).send('Invalid genre.');

        updateData.genre = {
            _id: genre._id,
            name: genre.name
        };
    }

    const query = req.user.isAdmin ? { _id: req.params.id } : { _id: req.params.id, 'user._id': req.user._id };
    const movie = await Movie.findOneAndUpdate(query,
        { $set: updateData },
        { returnDocument: 'after', new: true }
    );
    if (!movie) return res.status(404).send('Movie not found');
    res.send(movie);
});

export const createMovie = asyncMiddleware(async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');

    if (!mongoose.Types.ObjectId.isValid(req.user._id))
        return res.status(400).send('Invalid userId');
    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).send('Invalid user');

    const movie = new Movie({
        user: {
            _id: req.user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        },
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    const savedMovie = await movie.save();
    res.send(savedMovie);
});