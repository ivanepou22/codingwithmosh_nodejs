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
import { verifyMongooseId } from '../middleware/error.js';

const genreRoutes = express.Router();

genreRoutes.get('/', [auth], getGenres);
genreRoutes.get('/:id', [auth, verifyMongooseId], getGenre);
genreRoutes.post('/', [auth], createGenre);
genreRoutes.put('/:id', [auth, isAdmin, verifyMongooseId], updateGenre);
genreRoutes.delete('/:id', [auth, isAdmin, verifyMongooseId], deleteGenre);

export default genreRoutes;