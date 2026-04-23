import request from 'supertest';
import jwt from 'jsonwebtoken';
import { User } from '../../models/userModel.js';
import dotenv from 'dotenv';
import app from '../../index.js';
import { dbConnect, dbDisconnect } from '../../startup/dbConfig.js';
import { Genre } from '../../models/genreModel.js';
dotenv.config();

describe('Auth middleware', () => {
    beforeAll(async () => {
        await dbConnect();
    });

    afterAll(async () => {
        await dbDisconnect();
    });

    let token;

    beforeEach(() => {
        // token = new User().generateAuthToken();
        token = process.env.TEST_JWT_TOKEN;
    });
    const excecute = () => {
        return request(app)
            .get('/api/v1/users')
            .set('x-auth-token', token);
    }

    it('should return 401 if no token is provided', async () => {
        token = '';
        const res = await excecute();
        expect(res.status).toBe(401);
    }, 30000);

    it('should return 400 if token is invalid', async () => {
        token = 'invalid-token';
        const res = await excecute();
        expect(res.status).toBe(400);
    }, 30000);

    it('should return 200 if token is valid', async () => {
        const res = await excecute();
        expect(res.status).toBe(200);
    }, 30000);
});
