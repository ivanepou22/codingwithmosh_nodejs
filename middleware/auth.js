import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided.');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send('Invalid token.');
    }
}