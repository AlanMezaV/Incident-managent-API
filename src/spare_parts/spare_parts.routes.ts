import { Router } from 'express';
import { SparePartController } from './spare_parts.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();

const sparePartController = new SparePartController();

router.get('/spare-parts', authMiddleware, sparePartController.getAllSpareParts);
router.get('/spare-parts/:id', authMiddleware, sparePartController.getSparePartById);
router.post('/spare-parts', authMiddleware, sparePartController.createSparePart);
router.put('/spare-parts/:id', authMiddleware, sparePartController.updateSparePart);
router.delete('/spare-parts/:id', authMiddleware, sparePartController.deleteSparePart);

export default router;
