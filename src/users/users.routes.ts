import { Router } from 'express';
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUserInfo
} from './users.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();

router.get('/users', authMiddleware, getUsers);
router.get('/users/:id', authMiddleware, getUserById);
router.post('/users', createUser);
router.put('/users/:id', authMiddleware, updateUser);
router.delete('/users/:id', authMiddleware, deleteUser);
router.get('/info', authMiddleware, getUserInfo);

export default router;
