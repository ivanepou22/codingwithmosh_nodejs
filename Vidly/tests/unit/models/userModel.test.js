import { User } from "../../../models/userModel.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

describe('user.generateToken', () => {
    it('should return a valid JWT', () => {
        const payload = { _id: new mongoose.Types.ObjectId().toHexString(), isAdmin: true }
        const user = new User(payload);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        expect(decoded).toMatchObject(payload)
    });

});
