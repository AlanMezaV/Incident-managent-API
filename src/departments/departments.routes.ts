import Router from 'express';
import { DepartmentController } from './departments.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();
const departmentController = new DepartmentController();

router.get('/departments/:id', authMiddleware, departmentController.getDepartmentById);
router.post('/departments', departmentController.createDepartment);
router.put('/departments/:id', authMiddleware, departmentController.updateDepartment);
router.delete('/departments/:id', authMiddleware, departmentController.deleteDepartment);

export default router;
