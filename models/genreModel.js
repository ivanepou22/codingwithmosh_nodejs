import mongoose from "mongoose";

export const genreSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50
    },
    user: {
        type: new mongoose.Schema({
            name: { type: String },
            email: { type: String }
        }),
        required: true
    }
});

export const Genre = mongoose.model('Genre', genreSchema);