import express from 'express';
import { authenticate } from '../controllers/authController.js';

const authRoutes = express.Router();
authRoutes.post('/', authenticate);

export default authRoutes;