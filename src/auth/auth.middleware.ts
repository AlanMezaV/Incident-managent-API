// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// const JWT_SECRET = 'yourSecretKey';

// export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const token = req.headers['authorization'];

//         if (!token) {
//             return res.status(401).json({ message: 'Unauthorized' });
//         }

//         const decoded = jwt.verify(token, JWT_SECRET);

//         if (!decoded) {
//             return res.status(401).json({ message: 'Invalid token' });
//         }

//         req.user = decoded;
//         next();
//     } catch (error) {
//         console.error('Error in auth middleware:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };
