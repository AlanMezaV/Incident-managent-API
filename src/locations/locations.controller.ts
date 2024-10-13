import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Location from './location.model';
import Device from '../devices/device.model';

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
        type: req.body.type,
        description: req.body.description,
        building_id: req.body.building_id,
        department_id: req.body.department_id,
        location_manager: req.body.location_manager
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
        const { name, description, type, location_manager } = req.body;
        const updatedLocation = await Location.findByIdAndUpdate(
            id,
            { name, description, type, location_manager },
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
        const locations = await Location.find({ building_id }).populate('location_manager');
        res.status(StatusCodes.OK).json(locations);
    } catch (error) {
        console.error('Error getting locations by building id:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

export const searchLocations = async (req: Request, res: Response) => {
    const { name, type, description, buildingId, departmentId } = req.query;

    try {
        const filter: any = {};

        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }

        if (type) {
            filter.type = { $regex: type, $options: 'i' };
        }

        if (description) {
            filter.description = { $regex: description, $options: 'i' };
        }

        if (buildingId) {
            filter.building_id = buildingId;
        }

        if (departmentId) {
            filter.department_id = departmentId;
        }

        const locations = await Location.find(filter).populate('location_manager');

        if (locations.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'No locations found' });
        }

        return res.status(StatusCodes.OK).json(locations);
    } catch (error) {
        console.error('Error searching locations:', error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal server error' });
    }
};

export const getLocationsWithDevices = async (req: Request, res: Response) => {
    try {
        const { buildingId, departmentId } = req.query;

        // Verificar que location_id y department_id estén presentes
        if (!buildingId || !departmentId) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: 'location_id and department_id are required' });
        }

        // Buscar las ubicaciones que coincidan con location_id y department_id
        const locations = await Location.find({
            building_id: buildingId,
            department_id: departmentId
        }).populate('location_manager');

        if (locations.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'No locations found' });
        }

        const data = await Promise.all(
            locations.map(async location => {
                // Contar el número de dispositivos que tienen el mismo location_id
                const totalDevices = await Device.countDocuments({ location_id: location._id });

                // Agregar el totalDevices dentro del objeto location
                return {
                    ...location.toObject(), // Convertimos el documento de Mongoose a un objeto plano
                    totalDevices
                };
            })
        );

        return res.status(StatusCodes.OK).json(data);
    } catch (error) {
        console.error('Error getting locations and devices:', error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal server error' });
    }
};
