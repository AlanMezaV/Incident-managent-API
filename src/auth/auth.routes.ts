import { Router } from 'express';
import { login, logout, register, verifyToken } from './auth.controller';
import { authMiddleware } from './auth.middleware';

const router = Router();

router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.post('/register', register);
router.post('/verify', verifyToken);

export default router;
