import Router from 'express';
import {
    getBuildingDepartments,
    getBuildingDepartmentById,
    createBuildingDepartment,
    updateBuildingDepartment,
    getBuildingsByDepartment,
    getDepartmentsByBuilding
} from './buildings-departments.controller';

const router = Router();

router.get('/building-departments', getBuildingDepartments);
router.get('/building-departments/:id', getBuildingDepartmentById);
router.post('/building-departments', createBuildingDepartment);
router.put('/building-departments/:id', updateBuildingDepartment);
router.get('/building-departments/departments/:id', getDepartmentsByBuilding);
router.get('/building-departments/buildings/:id', getBuildingsByDepartment);

export default router;
