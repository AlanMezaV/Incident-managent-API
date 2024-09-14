import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET_KEY || 'your_secret_key';

// Crear un JWT
export const createToken = (payload: object, expiresIn: string = '1h'): string => {
    return jwt.sign(payload, secretKey, { expiresIn });
};

// Verificar el JWT
export const verifyToken = (token: string): any => {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        throw new Error('Token inválido');
    }
};

// Decodificar JWT sin verificar
export const decodeToken = (token: string): any => {
    return jwt.decode(token);
};
