import express from 'express';
import { auth } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';
import {
    createCustomer,
    deleteCustomer,
    getCustomer,
    getCustomers,
    updateCustomer
} from '../controllers/customerController.js';

const customerRoutes = express.Router();

customerRoutes.get('/', auth, getCustomers);
customerRoutes.get('/:id', auth, getCustomer);
customerRoutes.post('/', auth, createCustomer);
customerRoutes.put('/:id', [auth, isAdmin], updateCustomer);
customerRoutes.delete('/:id', [auth, isAdmin], deleteCustomer);

export default customerRoutes;