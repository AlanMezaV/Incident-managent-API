import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import './db';
import cookieParser from 'cookie-parser';
import UserRoutes from './users/users.routes';
import DepartmentRoutes from './departments/departments.routes';
import BuildingRoutes from './buildings/buildings.routes';
import AuthRoutes from './auth/auth.routes';
import LocationRoutes from './locations/locations.routes';
import DeviceRoutes from './devices/devices.routes';
import SidebarRoutes from './sidebar/sidebar.routes';
import PeriodsRoutes from './periods/periods.routes';
import IncidentsRoutes from './incidents/incidents.routes';
import SparePartsRoutes from './spare_parts/spare_parts.routes';
import ChangeRequestsRoutes from './change_requests/change_requests.routes';
import ServicesRoutes from './services/services.routes';

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
const corsOptions = {
    origin: 'https://incident-deploy.vercel.app',
    credentials: true
};
app.use(cors(corsOptions));
app.use(cookieParser());

// Routes
app.use('/', UserRoutes);
app.use('/', DepartmentRoutes);
app.use('/', BuildingRoutes);
app.use('/', LocationRoutes);
app.use('/', AuthRoutes);
app.use('/', DeviceRoutes);
app.use('/', SidebarRoutes);
app.use('/', PeriodsRoutes);
app.use('/', IncidentsRoutes);
app.use('/', SparePartsRoutes);
app.use('/', ChangeRequestsRoutes);
app.use('/', ServicesRoutes);

// Error handling
app.use((req, res, next) => {
    res.status(404).json({ message: 'Not found' });
});

export default app;
