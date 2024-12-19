import { Request, Response } from 'express';
import { createToken } from '../utils/jwtUtils';
import { StatusCodes } from 'http-status-codes';
import { verifyTokenJWT } from '../utils/jwtUtils';
import { SecurityService } from '../utils/security';
import { User } from '../users/schema/user.schema';
import cloudinary from '../utils/cloudinaryConfig';

export const register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, username, password, role, position, department_id } = req.body;

    try {
        // Verificar si el email y el username ya están registrados
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

        // Subir la imagen a Cloudinary
        let imageUrl: string | undefined;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url; // URL de la imagen subida
        }

        // Crear el nuevo usuario
        const newUser = new User({
            name,
            email,
            username,
            password: hashedPassword,
            role,
            position,
            department_id,
            imageUrl // Guardar la URL de la imagen si se subió
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

        const token = createToken(user.id.toString(), user.username);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 1000 * 60 * 60 * 8
        });

        res.status(StatusCodes.OK).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

export const logout = async (req: Request, res: Response): Promise<Response> => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none'
    });
    return res.status(200).json({ message: 'Session finished' });
};

export const verifyToken = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies['token'];

    if (!token) {
        res.status(StatusCodes.UNAUTHORIZED).json({
            valid: false,
            message: 'No token provided'
        });
        return;
    }

    try {
        verifyTokenJWT(token);
        res.status(StatusCodes.OK).json({ valid: true });
    } catch (error) {
        res.status(StatusCodes.UNAUTHORIZED).json({
            valid: false,
            message: 'Invalid or expired token'
        });
    }
};

export const updatePhoto = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);

        if (!user) {
            res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
            return;
        }

        let imageUrl: string | undefined;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
        }

        if (imageUrl) {
            user.imageUrl = imageUrl;
        }
        await user.save();
        res.status(StatusCodes.OK).json({ message: 'Photo updated successfully' });
    } catch (error) {
        console.error('Error updating photo:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

export const updatePassword = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findById(id).select('+password');

        if (!user) {
            res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
            return;
        }

        const securityService = new SecurityService();
        const isMatch = await securityService.compare(oldPassword, user.password);

        if (!isMatch) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid password' });
            return;
        }

        user.password = await securityService.hash(newPassword);
        await user.save();
        return res.status(StatusCodes.OK).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal server error' });
    }
};
