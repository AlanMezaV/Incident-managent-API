import { Request, Response, NextFunction } from 'express';
import { isTokenRevoked } from '../utils/revokedTokens';
import { verifyToken } from '../utils/jwtUtils';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    if (isTokenRevoked(token)) {
        return res.status(401).json({ message: 'Token revocado' });
    }

    try {
        const decoded = verifyToken(token);
        req.body.user = decoded;
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
};
