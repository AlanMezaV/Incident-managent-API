import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { SidebarService } from './sidebar.service';
import { CreateSidebarOptionsDto } from './dto/sidebar.dto';

export class SidebarController {
    private sidebarService: SidebarService;

    constructor() {
        this.sidebarService = new SidebarService();
    }

    getSidebarRoutes = async (req: Request, res: Response) => {
        try {
            const sidebarRoutes = await this.sidebarService.getSidebarRoutes();
            res.status(StatusCodes.OK).json(sidebarRoutes);
        } catch (error) {
            console.error('Error getting sidebar routes:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    createSidebarRoute = async (req: Request, res: Response) => {
        try {
            const createdRoute = await this.sidebarService.createSidebarOptions(
                req.body as CreateSidebarOptionsDto
            );
            res.status(StatusCodes.CREATED).json(createdRoute);
        } catch (error) {
            console.error('Error creating sidebar route:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    // Obtener rutas por rol de usuario
    getRoutesByRole = async (req: Request, res: Response) => {
        try {
            const role = req.params.role || req.body.role;
            if (!role) {
                res.status(400).json({ message: 'El rol es requerido' });
                return;
            }

            const routes = await this.sidebarService.getRoutesByRole(role);
            res.json(routes);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener las rutas por rol', error });
        }
    };
}
