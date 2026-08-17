import { Response } from 'express';
import { Database } from '../config/db.ts';
import { AuthRequest } from '../middleware/auth.ts';
import { GlobalJobService } from '../services/globalJobService.ts';

export const SavedJobsController = {
  async saveJob(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required to save jobs.' });
      }

      const { jobId } = req.body;
      if (!jobId) {
        return res.status(400).json({ success: false, message: 'Job ID is required.' });
      }

      let job = Database.findJobById(jobId);
      if (!job) {
        job = GlobalJobService.getJobById(jobId);
        if (job) {
          Database.createJob(job);
        }
      }

      if (!job) {
        return res.status(404).json({ success: false, message: 'Job listing not found.' });
      }

      const saved = Database.saveJob(req.user.id, jobId);
      return res.json({
        success: true,
        message: saved ? 'Job saved to your bookmarks!' : 'Job is already saved in your bookmarks.',
        saved: true
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Error saving job.' });
    }
  },

  async unsaveJob(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { jobId } = req.params;
      const removed = Database.unsaveJob(req.user.id, jobId);

      return res.json({
        success: true,
        message: 'Job removed from your bookmarks.',
        removed
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Error removing saved job.' });
    }
  },

  async getMySavedJobs(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const savedRecords = Database.getSavedJobsByUser(req.user.id);
      const jobs = savedRecords
        .map(record => {
          const job = Database.findJobById(record.jobId) || GlobalJobService.getJobById(record.jobId);
          if (!job) return null;
          return {
            ...job,
            isSaved: true,
            hasApplied: Database.hasApplied(job.id, req.user!.id),
            savedAt: record.savedAt
          };
        })
        .filter(Boolean)
        .sort((a, b) => new Date(b!.savedAt).getTime() - new Date(a!.savedAt).getTime());

      return res.json({ success: true, savedJobs: jobs });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Error retrieving saved jobs.' });
    }
  }
};
