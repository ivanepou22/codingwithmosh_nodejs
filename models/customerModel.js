import mongoose from "mongoose";

export const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    phone: {
        type: String,
        required: true,
        minLength: 5,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    },
    user: {
        type: new mongoose.Schema({
            name: { type: String },
            email: { type: String }
        }),
        required: true
    }
})

export const Customer = mongoose.model('Customer', customerSchema);