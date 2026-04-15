import Joi from "joi";
import mongoose from "mongoose";
import { Genre } from "../models/genreModel.js";
import { User } from "../models/userModel.js";
import { asyncMiddleware } from "../middleware/async.js";

export const getGenres = asyncMiddleware(async (req, res) => {
    const query = req.user.isAdmin ? {} : { 'user._id': req.user._id };
    const genres = await Genre.find(query).sort('name');
    res.send(genres);
});

export const getGenre = asyncMiddleware(async (req, res) => {
    const query = req.user.isAdmin ? { _id: req.params.id } : { _id: req.params.id, 'user._id': req.user._id };
    const genre = await Genre.findOne(query);
    if (!genre) return res.status(404).send('Genre not found');
    res.send(genre);
});

export const deleteGenre = asyncMiddleware(async (req, res) => {
    const query = req.user.isAdmin ? { _id: req.params.id } : { _id: req.params.id, 'user._id': req.user._id };
    const genre = await Genre.findOneAndDelete(query);
    if (!genre) return res.status(404).send('Genre not found');
    res.send(genre);
});

export const updateGenre = asyncMiddleware(async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const query = req.user.isAdmin ? { _id: req.params.id } : { _id: req.params.id, 'user._id': req.user._id };
    const genre = await Genre.findOneAndUpdate(query, {
        $set: {
            name: req.body.name
        }
    }, { returnDocument: 'after' });
    if (!genre) return res.status(404).send('Genre not found');
    res.send(genre);
});

export const createGenre = asyncMiddleware(async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (!mongoose.Types.ObjectId.isValid(req.user._id))
        return res.status(400).send('Invalid userId');
    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).send('Invalid user');

    const genre = new Genre({
        user: {
            _id: user._id,
            name: user.name,
            email: user.email
        },
        name: req.body.name
    });

    const savedGenre = await genre.save();
    res.send(savedGenre);
});

export const validateGenre = (genre) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    })
    return schema.validate(genre);
}