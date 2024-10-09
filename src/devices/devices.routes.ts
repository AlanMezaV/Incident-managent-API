import Router from 'express';
import {
    getDevices,
    getDeviceById,
    createDevice,
    updateDevice,
    deleteDevice,
    searchDevices,
    getDevicesByDepartmentId,
    getDevicesByDepartmentSearch
} from './devices.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();

router.get('/devices', authMiddleware, getDevices);
router.get('/devices/:id', getDeviceById);
router.post('/devices', createDevice);
router.put('/devices/:id', updateDevice);
router.delete('/devices/:id', authMiddleware, deleteDevice);
router.get('/devices-search', searchDevices);
router.get('/devices-by-department/:department_id', getDevicesByDepartmentId);
router.get('/devices-by-department-search', getDevicesByDepartmentSearch);

export default router;
