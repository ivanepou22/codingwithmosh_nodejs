import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin, name: this.name, email: this.email }, process.env.JWT_SECRET_KEY);
    return token;
}

export const User = mongoose.model('User', userSchema);