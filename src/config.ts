import { config } from 'dotenv';
config();

export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;

export const MONGODB_URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.h3uhe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
