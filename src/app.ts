import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import './db';
import UserRoutes from './users/users.routes';
import DepartmentRoutes from './departments/departments.routes';
import BuildingRoutes from './buildings/buildings.routes';
import BuildingDepartmentRoutes from './buildings-departments/buildings-departments.routes';

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// Routes
app.use('/', UserRoutes);
app.use('/', DepartmentRoutes);
app.use('/', BuildingRoutes);
app.use('/', BuildingDepartmentRoutes);

// Error handling
app.use((req, res, next) => {
    res.status(404).json({ message: 'Not found' });
});

export default app;
