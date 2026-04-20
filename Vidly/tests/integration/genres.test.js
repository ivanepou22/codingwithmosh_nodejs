import request from 'supertest';
import dotenv from 'dotenv';
import app from '../../index.js';
import { dbConnect } from '../../startup/dbConfig.js';
import { dbDisconnect } from '../../startup/dbConfig.js';
dotenv.config();

describe('/api/genres', () => {
    // Connect once before all tests
    beforeAll(async () => {
        await dbConnect();
    });
    // Disconnect after all tests
    afterAll(async () => {
        await dbDisconnect();
    });

    describe('/api/v1/genres', () => {
        it('should return all genres', async () => {
            const res = await request(app)
                .get('/api/v1/genres').set('x-auth-token', `${process.env.TEST_JWT_TOKEN}`);
            expect(res.status).toBe(200);
            // expect(Array.isArray(res.body)).toBe(true);   // recommended
        }, 30000);
    });
});