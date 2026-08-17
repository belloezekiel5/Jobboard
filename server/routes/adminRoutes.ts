import { Router } from 'express';
import { AdminController } from '../controllers/adminController.ts';
import { authenticate, authorize } from '../middleware/auth.ts';

const router = Router();

router.use(authenticate, authorize(['admin']));

router.get('/stats', AdminController.getStats);
router.get('/users', AdminController.getAllUsers);
router.put('/users/:id/status', AdminController.updateUserStatus);
router.delete('/users/:id', AdminController.deleteUser);
router.get('/jobs', AdminController.getAllJobsModeration);

export default router;
