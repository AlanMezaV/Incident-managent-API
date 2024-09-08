import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import User from './user.model';
import { SecurityService } from '../utils/security';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'yourSecretKey';

// Iniciar sesión
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid email or password' });
            return;
        }

        const securityService = new SecurityService();
        const isMatch = await securityService.compare(password, user.password);

        if (!isMatch) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid email or password' });
            return;
        }

        // Generar token JWT
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(StatusCodes.OK).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

// Registrar un usuario
export const register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, role, department_id } = req.body;

    try {
        // Verificar si el email ya está registrado
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            res.status(StatusCodes.CONFLICT).json({ message: 'Email already in use' });
            return;
        }

        // Encriptar la contraseña
        const securityService = new SecurityService();
        const hashedPassword = await securityService.hash(password);

        // Crear el nuevo usuario
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            department_id
        });

        // Guardar el usuario en la base de datos
        const savedUser = await newUser.save();

        // Generar token JWT
        const token = jwt.sign(
            { id: savedUser._id, email: savedUser.email, role: savedUser.role },
            JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        res.status(StatusCodes.CREATED).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

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
