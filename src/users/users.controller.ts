import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import User from './user.model';
import { SecurityService } from '../utils/security';

//Obtener todos los usuarios
export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.find().select('-password');
        res.status(StatusCodes.OK).json(user);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

//Obtener un usuario por id
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password');
        if (user) {
            res.status(StatusCodes.OK).json(user);
        } else {
            res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

// Crear un usuario
export const createUser = async (req: Request, res: Response) => {
    const securityService = new SecurityService();
    const hashedPassword = await securityService.hash(req.body.password);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role,
        department_id: req.body.department_id
    });
    try {
        const newUser = await user.save();
        res.status(StatusCodes.CREATED).json({ message: 'User added successfully', newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

// Actualizar un usuario por id
export const updateUser = async (req: Request, res: Response) => {
    try {
        const { password, ...rest } = req.body;

        if (password) {
            const securityService = new SecurityService();
            rest.password = await securityService.hash(password);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, rest, {
            new: true
        });
        if (updatedUser) {
            res.status(StatusCodes.OK).json({ message: 'User updated successfully', updatedUser });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

// Eliminar un usuario por ID
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (deletedUser) {
            res.status(StatusCodes.OK).json({ message: 'User deleted successfully', deletedUser });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

export const getUserInfo = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.body.user.userId;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
            return;
        }

        res.status(StatusCodes.OK).json(user);
    } catch (error) {
        console.error('Error getting user info:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

export const usersSearch = async (req: Request, res: Response) => {
    const { name, username, email, position, department_id } = req.query;

    try {
        const filter: any = {};

        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }

        if (username) {
            filter.username = { $regex: username, $options: 'i' };
        }

        if (email) {
            filter.email = { $regex: email, $options: 'i' };
        }

        if (position && position !== 'ALL') {
            filter.position = { $regex: position, $options: 'i' };
        }

        if (department_id) {
            filter.department_id = department_id;
            filter.role = { $ne: 'ADMIN_DEPARTMENT' };
        }

        const users = await User.find(filter).select('-password');

        return res.status(StatusCodes.OK).json(users);
    } catch (error) {
        console.error('Error searching users:', error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal server error' });
    }
};
