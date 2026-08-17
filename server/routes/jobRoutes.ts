import { Router } from 'express';
import { JobController } from '../controllers/jobController.ts';
import { authenticate, optionalAuth, authorize } from '../middleware/auth.ts';

const router = Router();

router.get('/', optionalAuth, JobController.getJobs);
router.get('/featured', optionalAuth, JobController.getFeaturedJobs);
router.get('/categories', JobController.getCategories);
router.get('/employer', authenticate, authorize(['employer', 'admin']), JobController.getEmployerJobs);
router.get('/:id', optionalAuth, JobController.getJobById);
router.post('/', authenticate, authorize(['employer', 'admin']), JobController.createJob);
router.put('/:id', authenticate, authorize(['employer', 'admin']), JobController.updateJob);
router.delete('/:id', authenticate, authorize(['employer', 'admin']), JobController.deleteJob);

export default router;
