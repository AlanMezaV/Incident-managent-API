import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Building from './building.model';

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
    const building = new Building({
        name: req.body.name,
        address: req.body.address
    });
    try {
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
    try {
        const { id } = req.params;
        const { name, address } = req.body;
        const updatedBuilding = await Building.findByIdAndUpdate(
            id,
            { name, address },
            { new: true }
        );
        if (updatedBuilding) {
            res.status(StatusCodes.OK).json({
                message: 'Building updated successfully',
                updatedBuilding
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({ message: 'Building not found' });
        }
    } catch (error) {
        console.error('Error updating building:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

// Delete a building by id
export const deleteBuilding = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedBuilding = await Building.findByIdAndDelete(id);
        if (deletedBuilding) {
            res.status(StatusCodes.OK).json({
                message: 'Building deleted successfully',
                deletedBuilding
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({ message: 'Building not found' });
        }
    } catch (error) {
        console.error('Error deleting building:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};
