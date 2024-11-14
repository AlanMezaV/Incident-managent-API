import { Router } from 'express';
import { SparePartController } from './spare_parts.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();

const sparePartController = new SparePartController();

router.get('/spare-parts', authMiddleware, sparePartController.getAllSpareParts);
router.get('/spare-part/:id', authMiddleware, sparePartController.getSparePartById);
router.post('/spare-part', authMiddleware, sparePartController.createSparePart);
router.put('/spare-part/:id', authMiddleware, sparePartController.updateSparePart);
router.delete('/spare-part/:id', authMiddleware, sparePartController.deleteSparePart);

export default router;
