import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import BuildingDepartment from './building-department.model';

//Obtener todos los edificios-departamentos
export const getBuildingDepartments = async (req: Request, res: Response): Promise<void> => {
    try {
        const buildingDepartments = await BuildingDepartment.find();
        res.status(StatusCodes.OK).json(buildingDepartments);
    } catch (error) {
        console.error('Error getting building-departments:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

//Obtener un edificio-departamento por id
export const getBuildingDepartmentById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const buildingDepartment = await BuildingDepartment.findById(id);
        if (buildingDepartment) {
            res.status(StatusCodes.OK).json(buildingDepartment);
        } else {
            res.status(StatusCodes.NOT_FOUND).json({ message: 'Building-Department not found' });
        }
    } catch (error) {
        console.error('Error getting building-department:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

//Crear un edificio-departamento
export const createBuildingDepartment = async (req: Request, res: Response) => {
    const buildingDepartment = new BuildingDepartment({
        department_id: req.body.department_id,
        building_id: req.body.building_id
    });
    try {
        const newBuildingDepartment = await buildingDepartment.save();
        res.status(StatusCodes.CREATED).json({
            message: 'Building-Department added successfully',
            newBuildingDepartment
        });
    } catch (error) {
        console.error('Error creating building-department:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

//Actualizar un edificio-departamento por id
export const updateBuildingDepartment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { department_id, building_id } = req.body;
        const updatedBuildingDepartment = await BuildingDepartment.findByIdAndUpdate(
            id,
            { department_id, building_id },
            { new: true }
        );
        if (updatedBuildingDepartment) {
            res.status(StatusCodes.OK).json({
                message: 'Building-Department updated successfully',
                updatedBuildingDepartment
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({ message: 'Building-Department not found' });
        }
    } catch (error) {
        console.error('Error updating building-department:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

//Eliminar un edificio-departamento por id
export const deleteBuildingDepartment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedBuildingDepartment = await BuildingDepartment.findByIdAndDelete(id);
        if (deletedBuildingDepartment) {
            res.status(StatusCodes.OK).json({
                message: 'Building-Department deleted successfully',
                deletedBuildingDepartment
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({ message: 'Building-Department not found' });
        }
    } catch (error) {
        console.error('Error deleting building-department:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

//Obtener todos los edificios de un departamento
export const getBuildingsByDepartment = async (req: Request, res: Response) => {
    try {
        const { department_id } = req.params;
        const buildingDepartments = await BuildingDepartment.find({ department_id });
        res.status(StatusCodes.OK).json(buildingDepartments);
    } catch (error) {
        console.error('Error getting buildings by department:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

//Obtener todos los departamentos de un edificio
export const getDepartmentsByBuilding = async (req: Request, res: Response) => {
    try {
        const { building_id } = req.params;
        const buildingDepartments = await BuildingDepartment.find({ building_id });
        res.status(StatusCodes.OK).json(buildingDepartments);
    } catch (error) {
        console.error('Error getting departments by building:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};
