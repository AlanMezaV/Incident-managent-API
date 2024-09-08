import { Router } from 'express';
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    login,
    register
} from './users.controller';
// import { authMiddleware } from '../auth/auth.middleware';

const router = Router();

// router.get('/protected', authMiddleware, async (req: Request, res: Response) => {
//     // This route is only accessible if the user is authenticated
//     res.json({ message: 'Hello, authenticated user!' });
// });

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/login', login);
router.post('/register', register);

export default router;
