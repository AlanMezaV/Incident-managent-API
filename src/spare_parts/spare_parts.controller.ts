import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { SparePartsService } from './spare_parts.service';
import { CreateSparePartsDto, UpdateSparePartsDto } from './dto/spare_parts.dto';

export class SparePartController {
    private sparePartService: SparePartsService;

    constructor() {
        this.sparePartService = new SparePartsService();
    }

    // Obtener todas las piezas de repuesto
    getAllSpareParts = async (req: Request, res: Response) => {
        try {
            const spareParts = await this.sparePartService.getSpareParts();
            res.status(StatusCodes.OK).json(spareParts);
        } catch (error) {
            console.error('Error getting spare parts:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    // Crear nueva pieza de repuesto
    createSparePart = async (req: Request, res: Response) => {
        const sparePartData: CreateSparePartsDto = req.body;
        try {
            const newSparePart = await this.sparePartService.createSparePart(sparePartData);
            res.status(StatusCodes.CREATED).json({
                message: 'Spare part created successfully',
                newSparePart
            });
        } catch (error) {
            console.error('Error creating spare part:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    // Actualizar pieza de repuesto
    updateSparePart = async (req: Request, res: Response) => {
        const sparePartId = req.params.id;
        const sparePartData: UpdateSparePartsDto = req.body;
        try {
            const updatedSparePart = await this.sparePartService.updateSparePart(
                sparePartId,
                sparePartData
            );
            if (updatedSparePart) {
                res.status(StatusCodes.OK).json({
                    message: 'Spare part updated successfully',
                    updatedSparePart
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Spare part not found' });
            }
        } catch (error) {
            console.error('Error updating spare part:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    // Obtener pieza de repuesto por id
    getSparePartById = async (req: Request, res: Response) => {
        try {
            const sparePart = await this.sparePartService.getSparePartById(req.params.id);
            if (sparePart) {
                res.status(StatusCodes.OK).json(sparePart);
            } else {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Spare part not found' });
            }
        } catch (error) {
            console.error('Error getting spare part:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    // Eliminar pieza de repuesto
    deleteSparePart = async (req: Request, res: Response) => {
        try {
            const sparePartId = req.params.id;
            const deletedSparePart = await this.sparePartService.deleteSparePart(sparePartId);
            if (deletedSparePart) {
                res.status(StatusCodes.OK).json({
                    message: 'Spare part deleted successfully',
                    deletedSparePart
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Spare part not found' });
            }
        } catch (error) {
            console.error('Error deleting spare part:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };
}
