// auth.routes.ts
import { Router } from 'express';
import { login, logout, register, verifyToken } from './auth.controller';
import { authMiddleware } from './auth.middleware';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinaryConfig';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        public_id: () => 'user_pictures'
    }
});

const upload = multer({ storage });

const router = Router();

router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.post('/register', upload.single('imagen'), register);
router.post('/verify', verifyToken);

export default router;
