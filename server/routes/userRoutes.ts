import { Router } from 'express';
import { UserController } from '../controllers/userController.ts';
import { authenticate } from '../middleware/auth.ts';

const router = Router();

router.get('/profile', authenticate, UserController.getProfile);
router.put('/profile', authenticate, UserController.updateProfile);
router.post('/resume', authenticate, UserController.uploadResume);
router.get('/:id', authenticate, UserController.getUserById);

export default router;
