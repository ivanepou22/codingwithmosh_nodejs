import { jest } from '@jest/globals';
import { auth } from "../../../middleware/auth";
import { User } from "../../../models/userModel";

describe('Auth Middleware', () => {
    it('should populate req.user with a payload valid JWT', async () => {
        const token = new User().generateAuthToken();
        const req = { header: jest.fn().mockReturnValue(token) };
        const res = {};
        const next = jest.fn();

        await auth(req, res, next);

        expect(req.user).toBeDefined();
    });

});
