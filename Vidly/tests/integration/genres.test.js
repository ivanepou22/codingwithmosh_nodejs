import request from 'supertest';
import jwt from 'jsonwebtoken';
import { Genre } from '../../models/genreModel.js';
import { User } from '../../models/userModel.js';
import dotenv from 'dotenv';
import app from '../../index.js';
import { dbConnect, dbDisconnect } from '../../startup/dbConfig.js';
dotenv.config();

describe('/api/genres', () => {
    beforeAll(async () => {
        await dbConnect();
    });

    afterAll(async () => {
        await dbDisconnect();
    });

    afterEach(async () => {
        await Genre.deleteMany({});
    });

    describe('GET /api/v1/genres', () => {
        const token = process.env.TEST_JWT_TOKEN;
        it('should return all genres', async () => {
            //decode the token to get the user id and role
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const user = await User.findById(decoded._id);
            // Seed the database with some genres
            await Genre.insertMany([
                {
                    name: 'Genre 1', user: {
                        _id: user._id, name: user.name,
                        email: user.email
                    }
                },
                {
                    name: 'Genre 2', user: {
                        _id: user._id, name: user.name,
                        email: user.email
                    }
                },
                {
                    name: 'Genre 3', user: {
                        _id: user._id, name: user.name,
                        email: user.email
                    }
                },
            ]);

            const res = await request(app)
                .get('/api/v1/genres').set('x-auth-token', `${token}`);
            expect(res.status).toBe(200);
            // expect(Array.isArray(res.body)).toBe(true);
            // expect(res.body.length).toBeGreaterThan(0);
        }, 30000);
    });

    describe('GET /api/v1/genres/:id', () => {
        const token = process.env.TEST_JWT_TOKEN;
        it('should return 404 for non-existent genre', async () => {
            const res = await request(app)
                .get('/api/v1/genres/69df6f2fa6ae77dc37eed07b').set('x-auth-token', `${token}`);
            expect(res.status).toBe(404);
        }, 30000);

        it('should return a genre if valid id is provided', async () => {
            //decode the token to get the user id and role
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const user = await User.findById(decoded._id);
            // Seed the database with a genre
            const genre = await Genre.create({
                name: 'Test Genre',
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }
            });

            const res = await request(app)
                .get(`/api/v1/genres/${genre._id}`).set('x-auth-token', `${token}`);
            expect(res.status).toBe(200);
            expect(res.body.name).toBe('Test Genre');
            expect(res.body).toHaveProperty('name', genre.name);
        }, 30000);

        it('should return 404 for non-existent genre', async () => {
            //decode the token to get the user id and role
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

            const res = await request(app)
                .get(`/api/v1/genres/69df557f08d7bf05bf5c065b`).set('x-auth-token', `${token}`);
            expect(res.status).toBe(404);
        }, 30000);

    });

    describe('POST /api/v1/genres', () => {
        let token;
        let name;
        const execute = async () => {
            return await request(app)
                .post('/api/v1/genres')
                .set('x-auth-token', `${token}`)
                .send({ name });
        };
        beforeEach(() => {
            token = process.env.TEST_JWT_TOKEN;
            name = 'New Genre';
        });

        it('should return 401 if user is not authenticated', async () => {
            token = '';
            name = 'New Genre';
            const res = await execute();
            expect(res.status).toBe(401);
        }, 30000);

        it('should return 400 if genre name is less than 5 characters', async () => {
            name = 'New'; // Set the name to a value less than 5 characters
            const res = await execute();
            expect(res.status).toBe(400);
        }, 30000);

        it('should return 400 if genre name is more than 50 characters', async () => {
            name = new Array(55).join('a'); // creates a string of 54 'a' characters
            const res = await execute();
            expect(res.status).toBe(400);
        }, 30000);

        it('should create a new genre if valid data is provided', async () => {
            //decode the token to get the user
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const user = await User.findById(decoded._id);
            name = 'New Genre';
            await execute();

            const genre = await Genre.find({ name: 'New Genre' });

            expect(genre).toBeTruthy();
            expect(genre).not.toBeNull();
        }, 30000);

        it('should return a genre if valid data is provided', async () => {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const user = await User.findById(decoded._id);
            name = 'New Genre';
            const res = await execute();

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('_id');
        });

    });


});