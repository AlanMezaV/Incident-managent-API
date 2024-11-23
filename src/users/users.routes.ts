import { Router } from 'express';
import { UserController } from './users.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();
const userController = new UserController();

router.get('/users/:id', authMiddleware, userController.getUserById);
router.put('/users/:id', authMiddleware, userController.updateUser);
router.delete('/users/:id', authMiddleware, userController.deleteUser);
router.get('/info', authMiddleware, userController.userInfo);
router.get('/users-search', authMiddleware, userController.usersSearch);
router.get(
    '/users-options-department/:department_id',
    authMiddleware,
    userController.userDepartmentOptions
);
router.get('/technicians', authMiddleware, userController.getTechniciansSpecialist);

export default router;
