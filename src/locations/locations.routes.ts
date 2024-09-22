import Router from 'express';
import {
    getLocations,
    getLocationById,
    createLocation,
    updateLocation,
    getLocationsByBuildingId,
    searchLocations
} from './locations.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();

router.get('/locations', getLocations);
router.get('/locations/:id', getLocationById);
router.post('/locations', createLocation);
router.put('/locations/:id', updateLocation);
router.get('/locations/buildings/:id', getLocationsByBuildingId);
router.get('/locations-search', authMiddleware, searchLocations);

export default router;
