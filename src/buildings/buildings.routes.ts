import Router from 'express';
import { BuildingController } from './buildings.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();
const buildingController = new BuildingController();

router.get('/buildings', authMiddleware, buildingController.getBuildings);
router.get('/buildings/:id', authMiddleware, buildingController.getBuildingById);
router.post('/buildings', authMiddleware, buildingController.createBuilding);
router.put('/buildings/:id', authMiddleware, buildingController.updateBuilding);
router.delete('/buildings/:id', authMiddleware, buildingController.deleteBuilding);
router.get('/buildings-search', authMiddleware, buildingController.searchBuildings);
router.put('/buildings-department/:id', authMiddleware, buildingController.addDepartmentToBuilding);

export default router;
