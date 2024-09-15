import { Request, Response } from 'express';
import { createToken } from '../utils/jwtUtils';
import { StatusCodes } from 'http-status-codes';
import { verifyTokenJWT } from '../utils/jwtUtils';
import { SecurityService } from '../utils/security';
import User from '../users/user.model';

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid username or password' });
            return;
        }

        const securityService = new SecurityService();
        const isMatch = await securityService.compare(password, user.password);

        if (!isMatch) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid email or password' });
            return;
        }

        const token = createToken({ username });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: true,
            maxAge: 1000 * 60 * 60 * 8
        });

        res.status(StatusCodes.OK).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

// Registrar un usuario
export const register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, username, password, role, department_id } = req.body;

    try {
        // Verificar si el email y el username ya está registrado
        const existingUser = await User.findOne({ email });
        const existingUsername = await User.findOne({ username });

        if (existingUser) {
            res.status(StatusCodes.CONFLICT).json({ message: 'Email already in use' });
            return;
        }

        if (existingUsername) {
            res.status(StatusCodes.CONFLICT).json({ message: 'Username already in use' });
            return;
        }

        // Encriptar la contraseña
        const securityService = new SecurityService();
        const hashedPassword = await securityService.hash(password);

        // Crear el nuevo usuario
        const newUser = new User({
            name,
            email,
            username,
            password: hashedPassword,
            role,
            department_id
        });

        // Guardar el usuario en la base de datos
        const savedUser = await newUser.save();
        res.status(StatusCodes.CREATED).json({
            message: 'User registered successfully',
            user: savedUser
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

export const logout = async (req: Request, res: Response): Promise<Response> => {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Sesión cerrada' });
};

export const verifyToken = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies['token'];

    if (!token) {
        res.status(StatusCodes.UNAUTHORIZED).json({
            valid: false
        });
        return;
    }

    try {
        const decoded = verifyTokenJWT(token);
        if (!decoded) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                valid: false
            });
            throw new Error('Invalid token');
        }
        res.status(StatusCodes.OK).json({ valid: true });
    } catch (error) {
        res.status(StatusCodes.UNAUTHORIZED).json({
            valid: false
        });
    }
};
