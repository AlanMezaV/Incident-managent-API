import Router from 'express';
import {
    getBuildings,
    getBuildingById,
    createBuilding,
    updateBuilding
} from './buildings.controller';

const router = Router();

router.get('/', getBuildings);
router.get('/:id', getBuildingById);
router.post('/', createBuilding);
router.put('/:id', updateBuilding);

export default router;
