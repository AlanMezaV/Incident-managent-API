import { Request, Response } from 'express';
import { createToken } from '../utils/jwtUtils';
import { StatusCodes } from 'http-status-codes';
import User from '../users/user.model';
import { SecurityService } from '../utils/security';
import { revokeToken } from '../utils/revokedTokens';

// Iniciar sesión
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid username or password' });
            return;
        }

        // Verificar la contraseña
        const securityService = new SecurityService();
        const isMatch = await securityService.compare(password, user.password);

        if (!isMatch) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid email or password' });
            return;
        }

        // Generar el token
        const token = createToken({ username });

        res.status(StatusCodes.OK).json({ message: 'Login successful', token });
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

        // Generar token JWT
        const token = createToken({ username });

        res.status(StatusCodes.CREATED).json({
            message: 'User registered successfully',
            token,
            user: savedUser
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

// Logout
export const logout = async (req: Request, res: Response): Promise<Response> => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (token) {
        revokeToken(token);
    }

    return res.status(200).json({ message: 'Sesión cerrada' });
};
