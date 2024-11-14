import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ChangeRequestService } from './change_requests.service';
import {
    CreateChangeRequestDTO,
    UpdateChangeRequestDTO,
    ChangeRequestSearchParamsDTO
} from './dto/change_request.dto';

export class ChangeRequestController {
    private changeRequestService: ChangeRequestService;

    constructor() {
        this.changeRequestService = new ChangeRequestService();
    }

    //Obtener ChangeRequest por id
    getChangeRequestById = async (req: Request, res: Response) => {
        try {
            const changeRequest = await this.changeRequestService.getChangeRequestById(
                req.params.id
            );
            if (changeRequest) {
                res.status(StatusCodes.OK).json(changeRequest);
            } else {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'ChangeRequest not found' });
            }
        } catch (error) {
            console.error('Error getting ChangeRequest:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    //Crear ChangeRequest
    createChangeRequest = async (req: Request, res: Response) => {
        const changeRequestData: CreateChangeRequestDTO = req.body;
        try {
            const newChangeRequest = await this.changeRequestService.createChangeRequest(
                changeRequestData
            );
            res.status(StatusCodes.CREATED).json({
                message: 'ChangeRequest created successfully',
                newChangeRequest
            });
        } catch (error) {
            console.error('Error creating ChangeRequest:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    //Actualizar ChangeRequest
    updateChangeRequest = async (req: Request, res: Response) => {
        const changeRequestData: UpdateChangeRequestDTO = req.body;
        try {
            const updatedChangeRequest = await this.changeRequestService.updateChangeRequest(
                req.params.id,
                changeRequestData
            );
            if (updatedChangeRequest) {
                res.status(StatusCodes.OK).json({
                    message: 'ChangeRequest updated successfully',
                    updatedChangeRequest
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'ChangeRequest not found' });
            }
        } catch (error) {
            console.error('Error updating ChangeRequest:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    //Aprobar ChangeRequest
    approveChangeRequest = async (req: Request, res: Response) => {
        try {
            const approvedChangeRequest = await this.changeRequestService.approveChangeRequest(
                req.params.id
            );
            if (approvedChangeRequest) {
                res.status(StatusCodes.OK).json({
                    message: 'ChangeRequest approved successfully',
                    approvedChangeRequest
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'ChangeRequest not found' });
            }
        } catch (error) {
            console.error('Error approving ChangeRequest:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    //Rechazar ChangeRequest
    rejectChangeRequest = async (req: Request, res: Response) => {
        try {
            const rejectedChangeRequest = await this.changeRequestService.rejectChangeRequest(
                req.params.id
            );
            if (rejectedChangeRequest) {
                res.status(StatusCodes.OK).json({
                    message: 'ChangeRequest rejected successfully',
                    rejectedChangeRequest
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'ChangeRequest not found' });
            }
        } catch (error) {
            console.error('Error rejecting ChangeRequest:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    //Eliminar ChangeRequest
    deleteChangeRequest = async (req: Request, res: Response) => {
        try {
            const deletedChangeRequest = await this.changeRequestService.deleteChangeRequest(
                req.params.id
            );
            if (deletedChangeRequest) {
                res.status(StatusCodes.OK).json({
                    message: 'ChangeRequest deleted successfully',
                    deletedChangeRequest
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'ChangeRequest not found' });
            }
        } catch (error) {
            console.error('Error deleting ChangeRequest:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    //Obtener ChangeRequest por criterios de busqueda
    searchChangeRequests = async (req: Request, res: Response) => {
        const searchParams: ChangeRequestSearchParamsDTO = req.query;
        try {
            const changeRequests = await this.changeRequestService.searchChangeRequests(
                searchParams
            );
            res.status(StatusCodes.OK).json(changeRequests);
        } catch (error) {
            console.error('Error getting ChangeRequests:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };
}
