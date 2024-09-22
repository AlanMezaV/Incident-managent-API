import jwt, { JwtPayload } from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET_KEY || 'liejoto';

// Crear un JWT
export const createToken = (userId: string, username: string, expiresIn: string = '8h'): string => {
    const payload = { userId, username }; // Asegúrate de que estas propiedades sean correctas
    return jwt.sign(payload, secretKey, { expiresIn });
};

// Verificar el JWT
export const verifyTokenJWT = (token: string): JwtPayload | string => {
    try {
        return jwt.verify(token, secretKey) as JwtPayload;
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Token inválido o expirado');
        }
        throw new Error('Error al verificar el token');
    }
};

// Decodificar JWT sin verificar
export const decodeToken = (token: string): any => {
    return jwt.decode(token);
};
