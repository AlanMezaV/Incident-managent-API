import { Router } from 'express';
import { ServicesController } from './services.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();

const servicesController = new ServicesController();

router.get('/services', authMiddleware, servicesController.getAllServices);
router.get('/services/:id', authMiddleware, servicesController.getServiceById);
router.post('/services', authMiddleware, servicesController.createService);
router.put('/services/:id', authMiddleware, servicesController.updateService);
router.delete('/services/:id', authMiddleware, servicesController.deleteService);

export default router;
