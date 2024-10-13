import { Router } from 'express';
import {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserInfo,
    usersSearch
} from './users.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();

router.get('/users', authMiddleware, getUsers);
router.get('/users/:id', authMiddleware, getUserById);
router.put('/users/:id', authMiddleware, updateUser);
router.delete('/users/:id', authMiddleware, deleteUser);
router.get('/info', authMiddleware, getUserInfo);
router.get('/users-search', authMiddleware, usersSearch);

export default router;
