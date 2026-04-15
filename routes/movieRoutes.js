import express from 'express';
import { auth } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';
import {
    createMovie,
    deleteMovie,
    getMovie,
    getMovies,
    updateMovie
} from '../controllers/movieController.js';

const movieRoutes = express.Router();

movieRoutes.get('/', [auth], getMovies);
movieRoutes.get('/:id', [auth], getMovie);
movieRoutes.post('/', [auth, isAdmin], createMovie);
movieRoutes.put('/:id', [auth, isAdmin], updateMovie);
movieRoutes.delete('/:id', [auth, isAdmin], deleteMovie);

export default movieRoutes;