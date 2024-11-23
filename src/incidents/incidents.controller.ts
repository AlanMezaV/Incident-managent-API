import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IncidentService } from './incidents.service';
import { CreateIncidentDto, SearchIncidentDto, UpdateIncidentDto } from './dto/incident.dto';

export class IncidentController {
    private incidentService: IncidentService;

    constructor() {
        this.incidentService = new IncidentService();
    }

    //Obtener todos los Incidents
    getIncidents = async (req: Request, res: Response) => {
        try {
            const incidents = await this.incidentService.getIncidents();
            res.status(StatusCodes.OK).json(incidents);
        } catch (error) {
            console.error('Error getting incidents:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    //Obtener Incident por id
    getIncidentById = async (req: Request, res: Response) => {
        try {
            const incident = await this.incidentService.getIncidentById(req.params.id);
            if (incident) {
                res.status(StatusCodes.OK).json(incident);
            } else {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Incident not found' });
            }
        } catch (error) {
            console.error('Error getting incident:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    getNewFolio = async (req: Request, res: Response) => {
        try {
            const newFolio = await this.incidentService.getNewFolio();
            res.status(StatusCodes.OK).json({ folio: newFolio });
        } catch (error) {
            console.error('Error getting new folio:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    //Crear Incident
    createIncident = async (req: Request, res: Response) => {
        const incidentData: CreateIncidentDto = req.body;
        try {
            const newIncident = await this.incidentService.createIncident(incidentData);
            res.status(StatusCodes.CREATED).json({
                message: 'Incident created successfully',
                newIncident
            });
        } catch (error) {
            console.error('Error creating incident:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error',
                error
            });
        }
    };

    //Actualizar Incident
    updateIncident = async (req: Request, res: Response) => {
        const incidentId = req.params.id;
        const incidentData: UpdateIncidentDto = req.body;
        try {
            const updatedIncident = await this.incidentService.updateIncident(
                incidentId,
                incidentData
            );
            if (updatedIncident) {
                res.status(StatusCodes.OK).json({
                    message: 'Incident updated successfully',
                    updatedIncident
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Incident not found' });
            }
        } catch (error) {
            console.error('Error updating incident:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    //Eliminar Incident
    deleteIncident = async (req: Request, res: Response) => {
        try {
            const deletedIncident = await this.incidentService.deleteIncident(req.params.id);
            if (deletedIncident) {
                res.status(StatusCodes.OK).json({
                    message: 'Incident deleted successfully',
                    deletedIncident
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Incident not found' });
            }
        } catch (error) {
            console.error('Error deleting incident:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    //Obtener incidentes por criterios de busqueda
    searchIncidents = async (req: Request, res: Response) => {
        const query: SearchIncidentDto = req.query;
        try {
            const incidents = await this.incidentService.searchIncidents(query);
            res.status(StatusCodes.OK).json(incidents);
        } catch (error) {
            console.error('Error searching incidents:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    //Obtener información del dashboard
    getDashboardStats = async (req: Request, res: Response) => {
        const { department_id, technician_id } = req.query;
        try {
            const dashboardInfo = await this.incidentService.getDashboardStats(
                department_id as string,
                technician_id as string
            );
            res.status(StatusCodes.OK).json(dashboardInfo);
        } catch (error) {
            console.error('Error getting dashboard info:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    // Obtener promedio de calificación de un técnico
    getTechnicianAverageQualification = async (req: Request, res: Response) => {
        const { technician_id } = req.query;
        try {
            const rating = await this.incidentService.getTechnicianAverageQualification(
                technician_id as string
            );
            res.status(StatusCodes.OK).json(rating);
        } catch (error) {
            console.error('Error getting technician rating:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };
}
