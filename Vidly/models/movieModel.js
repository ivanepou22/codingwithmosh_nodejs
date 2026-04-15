import mongoose from "mongoose";
import { genreSchema } from "./genreModel.js";

export const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 250
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        min: 0,
        default: 0
    },
    dailyRentalRate: {
        type: Number,
        min: 0,
        default: 0
    },
    user: {
        type: new mongoose.Schema({
            name: { type: String },
            email: { type: String }
        }),
        required: true
    }
})

export const Movie = mongoose.model('Movie', movieSchema);