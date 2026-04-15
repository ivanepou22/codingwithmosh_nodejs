import express from 'express';
import { auth } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';
import {
    createRental,
    deleteRental,
    getRental,
    getRentals,
    updateRental
} from '../controllers/rentalController.js';

const rentalRoutes = express.Router();

rentalRoutes.get('/', [auth], getRentals);
rentalRoutes.get('/:id', [auth], getRental);
rentalRoutes.post('/', [auth], createRental);
rentalRoutes.put('/:id', [auth, isAdmin], updateRental);
rentalRoutes.delete('/:id', [auth, isAdmin], deleteRental);

export default rentalRoutes;