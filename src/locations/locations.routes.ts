import Router from 'express';
import { LocationController } from './locations.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();
const locationController = new LocationController();

router.get('/locations/:id', locationController.getLocationById);
router.post('/locations', locationController.createLocation);
router.put('/locations/:id', locationController.updateLocation);
router.delete('/locations/:id', locationController.deleteLocation);
router.get('/locations-search', authMiddleware, locationController.searchLocations);
router.get('/locations-with-devices', locationController.getLocationsWithDevices);

export default router;
