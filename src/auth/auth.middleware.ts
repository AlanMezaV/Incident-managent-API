import { Request, Response, NextFunction } from 'express';
import { verifyTokenJWT } from '../utils/jwtUtils';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies['token'];

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    try {
        const decoded = verifyTokenJWT(token);
        req.body.user = decoded;
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
};
