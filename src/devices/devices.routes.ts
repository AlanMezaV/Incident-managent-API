import Router from 'express';
import { DeviceController } from './devices.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();
const deviceController = new DeviceController();

router.get('/devices/:id', deviceController.getDeviceById);
router.post('/devices', authMiddleware, deviceController.createDevice);
router.put('/devices/:id', authMiddleware, deviceController.updateDevice);
router.delete('/devices/:id', authMiddleware, deviceController.deleteDevice);
router.get('/devices-search', deviceController.searchDevices);
router.get('/devices-by-department-search', deviceController.searchDevicesByDepartment);
router.get(
    '/number-devices-by-department/:department_id',
    deviceController.getNumberDevicesByDepartment
);

export default router;
