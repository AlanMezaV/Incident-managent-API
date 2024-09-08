import mongoose from 'mongoose';
import { MONGODB_URI } from './config';

mongoose
    .connect(MONGODB_URI, {})
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Database connection error:', err));
