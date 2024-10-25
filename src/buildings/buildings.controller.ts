import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BuildingService } from './buildings.service';
import {
    CreateBuildingDTO,
    UpdateBuildingDTO,
    AddDepartmentToBuildingDTO,
    BuildingSearchParamsDTO
} from './dto/building.dto';

export class BuildingController {
    private buildingService: BuildingService;

    constructor() {
        this.buildingService = new BuildingService();
    }

    //Obtener buildings
    getBuildings = async (req: Request, res: Response) => {
        try {
            const buildings = await this.buildingService.getBuildings();
            res.status(StatusCodes.OK).json(buildings);
        } catch (error) {
            console.error('Error getting buildings:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    //Obtener building por id
    getBuildingById = async (req: Request, res: Response) => {
        try {
            const building = await this.buildingService.getBuildingById(req.params.id);
            if (building) {
                res.status(StatusCodes.OK).json(building);
            } else {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Building not found' });
            }
        } catch (error) {
            console.error('Error getting building:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    //Crear building
    createBuilding = async (req: Request, res: Response) => {
        const buildingData: CreateBuildingDTO = req.body;
        try {
            const newBuilding = await this.buildingService.createBuilding(buildingData);
            res.status(StatusCodes.CREATED).json({
                message: 'Building created successfully',
                newBuilding
            });
        } catch (error) {
            console.error('Error creating building:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    //Actualizar building
    updateBuilding = async (req: Request, res: Response) => {
        const buildingId = req.params.id;
        const buildingData: UpdateBuildingDTO = req.body;
        try {
            const updatedBuilding = await this.buildingService.updateBuilding(
                buildingId,
                buildingData
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
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    //Eliminar building
    deleteBuilding = async (req: Request, res: Response) => {
        try {
            const deletedBuilding = await this.buildingService.deleteBuilding(req.params.id);
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
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    //Añadir departamento a un edificio
    addDepartmentToBuilding = async (req: Request, res: Response) => {
        const buildingId = req.params.id;
        const data: AddDepartmentToBuildingDTO = req.body;
        try {
            const updatedBuilding = await this.buildingService.addDepartmentToBuilding(
                buildingId,
                data
            );
            if (updatedBuilding) {
                res.status(StatusCodes.OK).json({
                    message: 'Department added to building successfully',
                    updatedBuilding
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Building not found' });
            }
        } catch (error) {
            console.error('Error adding department to building:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    //Obtener buildings por criterios de busqueda
    searchBuildings = async (req: Request, res: Response) => {
        const query: BuildingSearchParamsDTO = req.query;
        try {
            const buildings = await this.buildingService.searchBuildings(
                req.body.user.userId,
                query
            );
            if (buildings) {
                res.status(StatusCodes.OK).json(buildings);
            } else {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Buildings not found' });
            }
        } catch (error) {
            console.error('Error searching buildings:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };
}
