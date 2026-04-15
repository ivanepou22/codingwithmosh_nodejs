import express from 'express';
import { auth } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';
import {
    createGenre,
    deleteGenre,
    getGenre,
    getGenres,
    updateGenre
} from '../controllers/genreController.js';

const genreRoutes = express.Router();

genreRoutes.get('/', [auth], getGenres);
genreRoutes.get('/:id', [auth], getGenre);
genreRoutes.post('/', [auth], createGenre);
genreRoutes.put('/:id', [auth, isAdmin], updateGenre);
genreRoutes.delete('/:id', [auth, isAdmin], deleteGenre);

export default genreRoutes;