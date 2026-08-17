import { Router } from 'express';
import { SavedJobsController } from '../controllers/savedJobsController.ts';
import { authenticate } from '../middleware/auth.ts';

const router = Router();

router.post('/save', authenticate, SavedJobsController.saveJob);
router.delete('/:jobId', authenticate, SavedJobsController.unsaveJob);
router.get('/', authenticate, SavedJobsController.getMySavedJobs);

export default router;
