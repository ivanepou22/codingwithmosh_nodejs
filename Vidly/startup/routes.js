import express from 'express';
import customerRoutes from '../routes/customerRoutes.js';
import movieRoutes from '../routes/movieRoutes.js';
import rentalRoutes from '../routes/RentalRoutes.js';
import userRoutes from '../routes/userRoutes.js';
import authRoutes from '../routes/authRoutes.js';
import genreRoutes from '../routes/genreRoutes.js';
import homeRoutes from '../routes/homeRoute.js';
import { error } from '../middleware/error.js';

export function routes(app) {
    app.use(express.json());
    app.use('/', homeRoutes);
    app.use('/api/v1/genres', genreRoutes);
    app.use('/api/v1/customers', customerRoutes);
    app.use('/api/v1/movies', movieRoutes);
    app.use('/api/v1/rentals', rentalRoutes);
    app.use('/api/v1/users', userRoutes);
    app.use('/api/v1/auth', authRoutes);

    // Error handling middleware should be registered after all routes and other middleware
    app.use(error);
}