import express from 'express';
import { auth } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';
import { validateObjectId } from '../middleware/validateObjectId.js';
import {
    createGenre,
    deleteGenre,
    getGenre,
    getGenres,
    updateGenre
} from '../controllers/genreController.js';

const genreRoutes = express.Router();

genreRoutes.get('/', auth, getGenres);
genreRoutes.get('/:id', auth, validateObjectId, getGenre);
genreRoutes.post('/', [auth, isAdmin], createGenre);
genreRoutes.put('/:id', [auth, isAdmin], validateObjectId, updateGenre);
genreRoutes.delete('/:id', [auth, isAdmin], validateObjectId, deleteGenre);

export default genreRoutes;