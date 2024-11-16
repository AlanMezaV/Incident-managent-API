import { Router } from 'express';
import { IncidentController } from './incidents.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();
const incidentController = new IncidentController();

router.get('/incidents', authMiddleware, incidentController.getIncidents);
router.get('/incidents/:id', incidentController.getIncidentById);
router.get('/incidents-folio', authMiddleware, incidentController.getNewFolio);
router.post('/incidents', authMiddleware, incidentController.createIncident);
router.put('/incidents/:id', authMiddleware, incidentController.updateIncident);
router.delete('/incidents/:id', authMiddleware, incidentController.deleteIncident);
router.get('/incidents-search', authMiddleware, incidentController.searchIncidents);
router.get('/dashboard-stats', authMiddleware, incidentController.getDashboardStats);

export default router;
