import { Router } from 'express';
import { SidebarController } from './sidebar.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();

const sidebarController = new SidebarController();

router.get('/sidebar/:role', authMiddleware, sidebarController.getRoutesByRole);

export default router;
