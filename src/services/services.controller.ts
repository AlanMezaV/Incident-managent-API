import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ServicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';

export class ServicesController {
    private servicesService: ServicesService;

    constructor() {
        this.servicesService = new ServicesService();
    }

    // Obtener todos los servicios
    getAllServices = async (req: Request, res: Response) => {
        try {
            const services = await this.servicesService.getServices();
            res.status(StatusCodes.OK).json(services);
        } catch (error) {
            console.error('Error getting services:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    // Crear nuevo servicio
    createService = async (req: Request, res: Response) => {
        const serviceData: CreateServiceDto = req.body;
        try {
            const newService = await this.servicesService.createService(serviceData);
            res.status(StatusCodes.CREATED).json({
                message: 'Service created successfully',
                newService
            });
        } catch (error) {
            console.error('Error creating service:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    // Actualizar servicio
    updateService = async (req: Request, res: Response) => {
        const serviceId = req.params.id;
        const serviceData: UpdateServiceDto = req.body;
        try {
            const updatedService = await this.servicesService.updateService(serviceId, serviceData);
            if (updatedService) {
                res.status(StatusCodes.OK).json({
                    message: 'Service updated successfully',
                    updatedService
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({
                    message: 'Service not found'
                });
            }
        } catch (error) {
            console.error('Error updating service:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    // Obtener servicio por id
    getServiceById = async (req: Request, res: Response) => {
        try {
            const service = await this.servicesService.getServiceById(req.params.id);
            if (service) {
                res.status(StatusCodes.OK).json(service);
            } else {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Service not found' });
            }
        } catch (error) {
            console.error('Error getting service:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    // Eliminar servicio
    deleteService = async (req: Request, res: Response) => {
        try {
            const serviceId = req.params.id;
            const deletedService = await this.servicesService.deleteService(serviceId);
            if (deletedService) {
                res.status(StatusCodes.OK).json({
                    message: 'Service deleted successfully'
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Service not found' });
            }
        } catch (error) {
            console.error('Error deleting service:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };
}
