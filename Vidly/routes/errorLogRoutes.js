import express from 'express';
import { auth } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';
import {
    getErrorLogs,
    getErrorLog,
    deleteErrorLog,
    clearOldLogs,
    getErrorLogStats
} from '../controllers/errorLogController.js';

const errorLogRoutes = express.Router();

// All routes require admin authentication
errorLogRoutes.get('/', [auth, isAdmin], getErrorLogs);
errorLogRoutes.get('/stats', [auth, isAdmin], getErrorLogStats);
errorLogRoutes.get('/:id', [auth, isAdmin], getErrorLog);
errorLogRoutes.delete('/:id', [auth, isAdmin], deleteErrorLog);
errorLogRoutes.delete('/', [auth, isAdmin], clearOldLogs);

export default errorLogRoutes;
