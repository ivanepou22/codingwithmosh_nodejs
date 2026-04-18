import mongoose from "mongoose";
import { customerSchema } from "./customerModel.js";

export const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
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
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 2,
                maxlength: 250
            },
            dailyRentalRate: {
                type: Number,
                min: 0,
                default: 0
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0,
        default: 0
    },
    user: {
        type: new mongoose.Schema({
            name: { type: String },
            email: { type: String },
            isAdmin: { type: Boolean }
        }),
        required: true
    }
})

export const Rental = mongoose.model('Rental', rentalSchema);