import Router from 'express';
import { LocationController } from './locations.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();
const locationController = new LocationController();

router.get('/locations/:id', authMiddleware, locationController.getLocationById);
router.post('/locations', authMiddleware, locationController.createLocation);
router.put('/locations/:id', authMiddleware, locationController.updateLocation);
router.delete('/locations/:id', authMiddleware, locationController.deleteLocation);
router.get('/locations-search', authMiddleware, locationController.searchLocations);
router.get('/locations-with-devices', authMiddleware, locationController.getLocationsWithDevices);

export default router;
