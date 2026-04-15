import express from 'express';
import { auth } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';
import {
    createUser,
    deleteUser,
    getCurrentUser,
    getUser,
    getUsers,
    updateUser
} from '../controllers/userController.js';

const userRoutes = express.Router();

userRoutes.get('/', [auth, isAdmin], getUsers);
userRoutes.get('/me', auth, getCurrentUser);
userRoutes.get('/:id', [auth, isAdmin], getUser);
userRoutes.post('/', createUser);
userRoutes.put('/:id', auth, updateUser);
userRoutes.delete('/:id', [auth, isAdmin], deleteUser);

export default userRoutes;