import Router from 'express';
import { ChangeRequestController } from './change_requests.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();

const changeRequestController = new ChangeRequestController();

router.get('/change-requests/:id', authMiddleware, changeRequestController.getChangeRequestById);
router.post('/change-requests', authMiddleware, changeRequestController.createChangeRequest);
router.post(
    '/change-requests-approve/:id',
    authMiddleware,
    changeRequestController.approveChangeRequest
);
router.post(
    '/change-requests-reject/:id',
    authMiddleware,
    changeRequestController.rejectChangeRequest
);
router.put('/change-requests/:id', authMiddleware, changeRequestController.updateChangeRequest);
router.delete('/change-requests/:id', authMiddleware, changeRequestController.deleteChangeRequest);
router.get('/change-requests-search', authMiddleware, changeRequestController.searchChangeRequests);

export default router;
