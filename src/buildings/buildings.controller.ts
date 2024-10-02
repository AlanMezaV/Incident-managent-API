// import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Building from './building.model';
import Location from '../locations/location.model';
import Device from '../devices/device.model';
import User from '../users/user.model';

// Get all buildings
export const getBuildings = async (req: Request, res: Response): Promise<void> => {
    try {
        const buildings = await Building.find();
        res.status(StatusCodes.OK).json(buildings);
    } catch (error) {
        console.error('Error getting buildings:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

// Get a building by id
export const getBuildingById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const building = await Building.findById(id);
        if (building) {
            res.status(StatusCodes.OK).json(building);
        } else {
            res.status(StatusCodes.NOT_FOUND).json({ message: 'Building not found' });
        }
    } catch (error) {
        console.error('Error getting building:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

// Create a building
export const createBuilding = async (req: Request, res: Response) => {
    const { name, description, isShared, department_id } = req.body;

    try {
        const building = new Building({
            name,
            description,
            isShared,
            department_id: []
        });

        if (isShared && Array.isArray(department_id)) {
            building.department_id = department_id;
        } else if (department_id) {
            building.department_id = [department_id];
        }

        const newBuilding = await building.save();

        res.status(StatusCodes.CREATED).json({
            message: 'Building added successfully',
            newBuilding
        });
    } catch (error) {
        console.error('Error creating building:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

// Update a building by id
export const updateBuilding = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, isShared, department_id } = req.body;

    try {
        const building = await Building.findById(id);

        if (!building) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Building not found' });
        }

        building.name = name || building.name;
        building.description = description || building.description;
        building.isShared = isShared ?? building.isShared;

        if (isShared && Array.isArray(department_id)) {
            building.department_id = department_id;
        } else if (department_id) {
            building.department_id = [department_id];
        }

        const updatedBuilding = await building.save();

        return res.status(StatusCodes.OK).json({
            message: 'Building updated successfully',
            updatedBuilding
        });
    } catch (error) {
        console.error('Error updating building:', error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal server error' });
    }
};

// Delete a building by id and associated locations
export const deleteBuilding = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Primero, eliminamos todas las ubicaciones asociadas al edificio
        await Location.deleteMany({ building_id: id });

        // Luego, eliminamos el edificio
        const deletedBuilding = await Building.findByIdAndDelete(id);
        if (deletedBuilding) {
            return res.status(StatusCodes.OK).json({
                message: 'Building and associated locations deleted successfully',
                deletedBuilding
            });
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Building not found' });
        }
    } catch (error) {
        console.error('Error deleting building:', error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal server error' });
    }
};
export const searchBuildings = async (req: Request, res: Response) => {
    const userId = req.body.user.userId;
    const { name, description, isShared, departmentId } = req.query;

    try {
        // Primero, obtenemos el department_id del usuario
        const user = await User.findById(userId);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        }
        const userDepartmentId = user.department_id;

        const filter: any = {};

        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }

        if (description) {
            filter.description = { $regex: description, $options: 'i' };
        }

        if (isShared !== undefined) {
            const isSharedBoolean = isShared === 'true';
            filter.isShared = isSharedBoolean;

            if (isSharedBoolean) {
                filter.department_id = { $nin: [userDepartmentId] };
            }
        }

        if (departmentId) {
            filter.department_id = departmentId;
        }

        const buildings = await Building.find(filter);

        if (buildings.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'No buildings found' });
        }

        // Contar dispositivos por cada edificio y agregar totalDevices
        const buildingsWithDevices = await Promise.all(
            buildings.map(async building => {
                // Encontrar ubicaciones que coincidan con el department_id del edificio
                const locations = await Location.find({
                    building_id: building._id,
                    department_id: departmentId
                });

                // Contar los dispositivos asociados a las ubicaciones encontradas
                const totalDevices = await Device.countDocuments({
                    location_id: { $in: locations.map(loc => loc._id) }
                });

                // Devolver el edificio con la propiedad totalDevices
                return {
                    ...building.toObject(),
                    totalDevices
                };
            })
        );

        return res.status(StatusCodes.OK).json(buildingsWithDevices);
    } catch (error) {
        console.error('Error searching buildings:', error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal server error' });
    }
};

export const addDepartmentToBuilding = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { departmentId } = req.body;

    try {
        const building = await Building.findById(id);

        if (!building) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Building not found' });
        }

        if (!building.isShared) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Building is not shared' });
        }

        building.department_id.push(departmentId);

        const updatedBuilding = await building.save();

        return res.status(StatusCodes.OK).json({
            message: 'Department added to building successfully',
            updatedBuilding
        });
    } catch (error) {
        console.error('Error adding department to building:', error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal server error' });
    }
};
