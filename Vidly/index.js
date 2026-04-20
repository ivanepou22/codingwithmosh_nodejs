import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { dbConnect } from './startup/dbConfig.js';
import { routes } from './startup/routes.js';
import { logging } from './startup/logging.js';
import winston from 'winston';

const app = express();
dotenv.config();
app.use(helmet());

logging();
routes(app);

export default app;
const port = process.env.PORT || 5000;
app.listen(port, () => {
    dbConnect();
    winston.info(`Server listening on: ${port}`);
})