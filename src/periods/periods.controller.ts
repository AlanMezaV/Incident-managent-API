import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PeriodService } from './periods.service';
import { CreatePeriodDto, UpdatePeriodDto } from './dto/period.dto';

export class PeriodController {
    private periodService: PeriodService;

    constructor() {
        this.periodService = new PeriodService();
    }

    // Obtener periodo activo
    getActivePeriod = async (req: Request, res: Response) => {
        try {
            const activePeriod = await this.periodService.getActivePeriod();
            res.status(StatusCodes.OK).json(activePeriod);
        } catch (error) {
            console.error('Error getting active period:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    // Obtener ultimo periodo
    getLastPeriod = async (req: Request, res: Response) => {
        try {
            const lastPeriod = await this.periodService.getLastPeriod();
            res.status(StatusCodes.OK).json(lastPeriod);
        } catch (error) {
            console.error('Error getting last period:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    // Establecer nuevo periodo activo
    setActivePeriod = async (req: Request, res: Response) => {
        const periodId = req.params.id;
        try {
            const updatedPeriod = await this.periodService.setActivePeriod(periodId);
            res.status(StatusCodes.OK).json({
                message: 'Period updated successfully',
                updatedPeriod
            });
        } catch (error) {
            console.error('Error setting active period:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    // Obtener periodo por id
    getPeriodById = async (req: Request, res: Response) => {
        try {
            const period = await this.periodService.getPeriodById(req.params.id);
            if (period) {
                res.status(StatusCodes.OK).json(period);
            } else {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Period not found' });
            }
        } catch (error) {
            console.error('Error getting period:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    // Crear periodo
    createPeriod = async (req: Request, res: Response) => {
        const periodData: CreatePeriodDto = req.body;
        try {
            const newPeriod = await this.periodService.createPeriod(periodData);
            res.status(StatusCodes.CREATED).json({
                message: 'Period created successfully',
                newPeriod
            });
        } catch (error) {
            console.error('Error creating period:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    // Actualizar periodo
    updatePeriod = async (req: Request, res: Response) => {
        const periodId = req.params.id;
        const periodData: UpdatePeriodDto = req.body;
        try {
            const updatedPeriod = await this.periodService.updatePeriod(periodId, periodData);
            if (updatedPeriod) {
                res.status(StatusCodes.OK).json({
                    message: 'Period updated successfully',
                    updatedPeriod
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Period not found' });
            }
        } catch (error) {
            console.error('Error updating period:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    // Eliminar periodo
    deletePeriod = async (req: Request, res: Response) => {
        try {
            const deletedPeriod = await this.periodService.deletePeriod(req.params.id);
            if (deletedPeriod) {
                res.status(StatusCodes.OK).json({
                    message: 'Period deleted successfully',
                    deletedPeriod
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Period not found' });
            }
        } catch (error) {
            console.error('Error deleting period:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };
}
