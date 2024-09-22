import Router from 'express';
import {
    getBuildings,
    getBuildingById,
    createBuilding,
    updateBuilding,
    deleteBuilding,
    searchBuildings,
    addDepartmentToBuilding
} from './buildings.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();

router.get('/buildings', authMiddleware, getBuildings);
router.get('/buildings/:id', authMiddleware, getBuildingById);
router.post('/buildings', createBuilding);
router.put('/buildings/:id', authMiddleware, updateBuilding);
router.delete('/buildings/:id', authMiddleware, deleteBuilding);
router.get('/buildings-search', authMiddleware, searchBuildings);
router.put('/buildings-department/:id', authMiddleware, addDepartmentToBuilding);

export default router;
