import express from 'express';
import helmet from 'helmet';
// import config from 'config';
import morgan from 'morgan';
import debug from 'debug';
import genreRoutes from './routes/genreRoutes.js';
import homeRoutes from './routes/homeRoute.js';
import { dbConnect } from './dbConfig.js';
import customerRoutes from './routes/customerRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import rentalRoutes from './routes/RentalRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { error } from './middleware/error.js';
import { verifyMongooseId } from './middleware/error.js';

const appDebug = debug('app:startup');
const dbDebug = debug('app:db');

const app = express();
app.use(helmet());
app.use(express.json());

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    appDebug('Morgan enabled...');
}

//getting config values
// console.log(`Application Name: ${config.get('name')}`);
// console.log(`Application Version: ${config.get('version')}`);
// console.log(`Mail Host: ${config.get('mail.host')}`);
// console.log(`Mail Port: ${config.get('mail.port')}`);
// console.log(`Mail Password: ${config.get('mail.password')}`);
// > $env:mailtrap_password="1234"  // in powershell to set environment variable for mail password
// $env:NODE_ENV = "production"

// console.log(app.get('env'));
// console.log(process.env.debug);

app.use('/', homeRoutes);
app.use('/api/v1/genres', genreRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/movies', movieRoutes);
app.use('/api/v1/rentals', rentalRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);

// Error handling middleware should be registered after all routes and other middleware
app.use(error);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    // dbDebug('Connected to the database...');
    dbConnect();
    console.log(`Server listening on: ${port}`);
})