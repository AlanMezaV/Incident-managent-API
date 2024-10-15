import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { LocationService } from './locations.service';
import { createLocationDTO, LocationSearchParamsDTO, updateLocationDTO } from './dto/location.dto';

export class LocationController {
    private locationService: LocationService;

    constructor() {
        this.locationService = new LocationService();
    }

    //Obtener location por id
    getLocationById = async (req: Request, res: Response) => {
        try {
            const location = await this.locationService.getLocationById(req.params.id);
            if (location) {
                res.status(StatusCodes.OK).json(location);
            } else {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Location not found' });
            }
        } catch (error) {
            console.error('Error getting location:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    //Crear location
    createLocation = async (req: Request, res: Response) => {
        const locationData: createLocationDTO = req.body;
        try {
            const newLocation = await this.locationService.createLocation(locationData);
            res.status(StatusCodes.CREATED).json({
                message: 'Location created successfully',
                newLocation
            });
        } catch (error) {
            console.error('Error creating location:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    //Actualizar location
    updateLocation = async (req: Request, res: Response) => {
        const locationId = req.params.id;
        const locationData: updateLocationDTO = req.body;
        try {
            const updatedLocation = await this.locationService.updateLocation(
                locationId,
                locationData
            );
            if (updatedLocation) {
                res.status(StatusCodes.OK).json({
                    message: 'Location updated successfully',
                    updatedLocation
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Location not found' });
            }
        } catch (error) {
            console.error('Error updating location:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    //Eliminar location
    deleteLocation = async (req: Request, res: Response) => {
        try {
            const deletedLocation = await this.locationService.deleteLocation(req.params.id);
            if (deletedLocation) {
                res.status(StatusCodes.OK).json({
                    message: 'Location deleted successfully',
                    deletedLocation
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Location not found' });
            }
        } catch (error) {
            console.error('Error deleting location:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    //Obtener locations por criterios de busqueda
    searchLocations = async (req: Request, res: Response) => {
        const searchParams: LocationSearchParamsDTO = req.query;
        try {
            const locations = await this.locationService.searchLocations(searchParams);
            if (locations) {
                res.status(StatusCodes.OK).json(locations);
            } else {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Location not found' });
            }
        } catch (error) {
            console.error('Error searching locations:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    //Obtener locations con dispositivos
    getLocationsWithDevices = async (req: Request, res: Response) => {
        const searchParams: LocationSearchParamsDTO = req.query;
        try {
            const locations = await this.locationService.getLocationsWithDevices(searchParams);
            if (locations) {
                res.status(StatusCodes.OK).json(locations);
            } else {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Location not found' });
            }
        } catch (error) {
            console.error('Error getting locations with devices:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };
}
