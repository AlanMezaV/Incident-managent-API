import { Router } from 'express';
import { PeriodController } from './periods.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();
const periodController = new PeriodController();

router.get('/active-period', authMiddleware, periodController.getActivePeriod);
router.get('/last-period', authMiddleware, periodController.getLastPeriod);
router.get('/period/:id', authMiddleware, periodController.getPeriodById);
router.post('/period', periodController.createPeriod);
router.put('/period/:id', authMiddleware, periodController.updatePeriod);
router.put('/set-active-period/:id', authMiddleware, periodController.setActivePeriod);

export default router;
