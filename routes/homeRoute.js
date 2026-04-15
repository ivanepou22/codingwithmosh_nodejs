import express from 'express';
const homeRoutes = express.Router();

homeRoutes.get('', (_req, res) => {
    res.send('Your Welcome to Vidly Api');
})

export default homeRoutes;