import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserService } from './users.service';
import { UserSearchParamsDTO } from './dto/user.dto';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    // Actualizar usuario
    updateUser = async (req: Request, res: Response) => {
        try {
            const updatedUser = await this.userService.updateUser(req.params.id, req.body);
            if (updatedUser) {
                res.status(StatusCodes.OK).json({
                    message: 'User updated successfully',
                    updatedUser
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    // Eliminar usuario
    deleteUser = async (req: Request, res: Response) => {
        try {
            const deletedUser = await this.userService.deleteUser(req.params.id);
            if (deletedUser) {
                res.status(StatusCodes.OK).json({
                    message: 'User deleted successfully',
                    deletedUser
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    userInfo = async (req: Request, res: Response) => {
        try {
            const userId = req.body.user.userId;
            const user = await this.userService.getUserInfo(userId);

            if (!user) {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
                return;
            }

            res.status(StatusCodes.OK).json(user);
        } catch (error) {
            console.error('Error getting user info:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    // Buscar usuarios
    usersSearch = async (req: Request, res: Response) => {
        const searchParams: UserSearchParamsDTO = req.query;
        try {
            const users = await this.userService.searchUsers(searchParams);
            res.status(StatusCodes.OK).json(users);
        } catch (error) {
            console.error('Error searching users:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    // Opciones de usuarios por departamento
    userDepartmentOptions = async (req: Request, res: Response) => {
        try {
            const users = await this.userService.getUsersByDepartment(req.params.department_id);
            res.status(StatusCodes.OK).json(users);
        } catch (error) {
            console.error('Error getting users by department:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };
}
