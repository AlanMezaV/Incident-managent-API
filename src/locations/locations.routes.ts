import Router from 'express';
import {
    getLocations,
    getLocationById,
    createLocation,
    updateLocation,
    getLocationsByBuildingId
} from './locations.controller';

const router = Router();

router.get('/locations', getLocations);
router.get('/locations/:id', getLocationById);
router.post('/locations', createLocation);
router.put('/locations/:id', updateLocation);
router.get('/locations/buildings/:id', getLocationsByBuildingId);

export default router;
