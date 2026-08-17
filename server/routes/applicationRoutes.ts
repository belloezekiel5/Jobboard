import { Router } from 'express';
import { ApplicationController } from '../controllers/applicationController.ts';
import { authenticate, authorize } from '../middleware/auth.ts';

const router = Router();

router.post('/apply', authenticate, ApplicationController.apply);
router.get('/my-applications', authenticate, ApplicationController.getMyApplications);
router.get('/employer-applications', authenticate, authorize(['employer', 'admin']), ApplicationController.getEmployerApplications);
router.put('/:id/status', authenticate, authorize(['employer', 'admin']), ApplicationController.updateStatus);
router.delete('/:id', authenticate, ApplicationController.withdraw);

export default router;
