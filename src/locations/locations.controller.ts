import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Location from './location.model';

// Get all locations
export const getLocations = async (req: Request, res: Response): Promise<void> => {
    try {
        const locations = await Location.find();
        res.status(StatusCodes.OK).json(locations);
    } catch (error) {
        console.error('Error getting locations:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

// Get a location by id
export const getLocationById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const location = await Location.findById(id);
        if (location) {
            res.status(StatusCodes.OK).json(location);
        } else {
            res.status(StatusCodes.NOT_FOUND).json({ message: 'Location not found' });
        }
    } catch (error) {
        console.error('Error getting location:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

// Create a location
export const createLocation = async (req: Request, res: Response) => {
    const location = new Location({
        name: req.body.name,
        address: req.body.address
    });
    try {
        const newLocation = await location.save();
        res.status(StatusCodes.CREATED).json({
            message: 'Location added successfully',
            newLocation
        });
    } catch (error) {
        console.error('Error creating location:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

// Update a location by id
export const updateLocation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, address } = req.body;
        const updatedLocation = await Location.findByIdAndUpdate(
            id,
            { name, address },
            { new: true }
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
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

// Delete a location by id
export const deleteLocation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedLocation = await Location.findByIdAndDelete(id);
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
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

// Get all locations by building id
export const getLocationsByBuildingId = async (req: Request, res: Response) => {
    try {
        const { building_id } = req.params;
        const locations = await Location.find({ building_id });
        res.status(StatusCodes.OK).json(locations);
    } catch (error) {
        console.error('Error getting locations by building id:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};
