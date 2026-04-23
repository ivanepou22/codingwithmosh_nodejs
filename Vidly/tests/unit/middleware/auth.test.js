import { jest } from '@jest/globals';
import { auth } from "../../../middleware/auth";
import { User } from "../../../models/userModel";
import mongoose from 'mongoose';

describe('Auth Middleware', () => {
    it('should populate req.user with a payload valid JWT', async () => {
        const user = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        };
        const token = new User(user).generateAuthToken();
        const req = { header: jest.fn().mockReturnValue(token) };
        const res = {};
        const next = jest.fn();

        await auth(req, res, next);

        expect(req.user).toMatchObject(user);
    });

});
