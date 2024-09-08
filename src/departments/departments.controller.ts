import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Department from './department.model';

// Obtener todos los departamentos
export const getDepartments = async (req: Request, res: Response): Promise<void> => {
    try {
        const departments = await Department.find();
        res.status(StatusCodes.OK).json(departments);
    } catch (error) {
        console.error('Error getting departments:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

// Obtener un departamento por id
export const getDepartmentById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const department = await Department.findById(id);
        if (department) {
            res.status(StatusCodes.OK).json(department);
        } else {
            res.status(StatusCodes.NOT_FOUND).json({ message: 'Department not found' });
        }
    } catch (error) {
        console.error('Error getting department:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

// Crear un departamento
export const createDepartment = async (req: Request, res: Response) => {
    const department = new Department({
        name: req.body.name,
        description: req.body.description
    });
    try {
        const newDepartment = await department.save();
        res.status(StatusCodes.CREATED).json({
            message: 'Department added successfully',
            newDepartment
        });
    } catch (error) {
        console.error('Error creating department:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

// Actualizar un departamento por id
export const updateDepartment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const updatedDepartment = await Department.findByIdAndUpdate(
            id,
            { name, description },
            { new: true }
        );
        if (updatedDepartment) {
            res.status(StatusCodes.OK).json({
                message: 'Department updated successfully',
                updatedDepartment
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({ message: 'Department not found' });
        }
    } catch (error) {
        console.error('Error updating department:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

// Eliminar un departamento por id
export const deleteDepartment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedDepartment = await Department.findByIdAndDelete(id);
        if (deletedDepartment) {
            res.status(StatusCodes.OK).json({
                message: 'Department deleted successfully',
                deletedDepartment
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({ message: 'Department not found' });
        }
    } catch (error) {
        console.error('Error deleting department:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};
