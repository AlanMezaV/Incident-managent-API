import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { DepartmentService } from './departments.service';
import { CreateDepartmentDTO, UpdateDepartmentDTO } from './dto/department.dto';

export class DepartmentController {
    private departmentService: DepartmentService;

    constructor() {
        this.departmentService = new DepartmentService();
    }

    //Obtener department por id
    getDepartmentById = async (req: Request, res: Response) => {
        try {
            const department = await this.departmentService.getDepartmentById(req.params.id);
            if (department) {
                res.status(StatusCodes.OK).json(department);
            } else {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Department not found' });
            }
        } catch (error) {
            console.error('Error getting department:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    //Crear department
    createDepartment = async (req: Request, res: Response) => {
        const departmentData: CreateDepartmentDTO = req.body;
        try {
            const newDepartment = await this.departmentService.createDepartment(departmentData);
            res.status(StatusCodes.CREATED).json({
                message: 'Department created successfully',
                newDepartment
            });
        } catch (error) {
            console.error('Error creating department:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    //Actualizar department
    updateDepartment = async (req: Request, res: Response) => {
        const departmentId = req.params.id;
        const departmentData: UpdateDepartmentDTO = req.body;
        try {
            const updatedDepartment = await this.departmentService.updateDepartment(
                departmentId,
                departmentData
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
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    //Eliminar department
    deleteDepartment = async (req: Request, res: Response) => {
        try {
            const deletedDepartment = await this.departmentService.deleteDepartment(req.params.id);
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
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };
}
