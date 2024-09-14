import { Router } from 'express';
import { login, logout, register } from './auth.controller';
import { authMiddleware } from './auth.middleware';

const router = Router();

router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.post('/register', register);

export default router;
