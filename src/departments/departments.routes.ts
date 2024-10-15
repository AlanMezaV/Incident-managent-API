import Router from 'express';
import { DepartmentController } from './departments.controller';

const router = Router();
const departmentController = new DepartmentController();

router.get('/departments/:id', departmentController.getDepartmentById);
router.post('/departments', departmentController.createDepartment);
router.put('/departments/:id', departmentController.updateDepartment);
router.delete('/departments/:id', departmentController.deleteDepartment);

export default router;
