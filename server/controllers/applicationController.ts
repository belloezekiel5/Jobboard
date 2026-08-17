import { Response } from 'express';
import { Database } from '../config/db.ts';
import { AuthRequest } from '../middleware/auth.ts';
import { Application, ApplicationStatus } from '../models/types.ts';
import { GlobalJobService } from '../services/globalJobService.ts';

export const ApplicationController = {
  async apply(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required to apply for jobs.' });
      }

      const { jobId, coverLetter, resumeUrl, resumeName, phone, portfolioUrl } = req.body;

      if (!jobId) {
        return res.status(400).json({ success: false, message: 'Job ID is required.' });
      }

      let job = Database.findJobById(jobId);
      if (!job) {
        job = GlobalJobService.getJobById(jobId);
        if (job) {
          // Temporarily register in database so foreign key / detail lookups work smoothly
          Database.createJob(job);
        }
      }

      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found.' });
      }

      if (job.status !== 'Active') {
        return res.status(400).json({ success: false, message: 'This job listing is no longer active.' });
      }

      // Check if already applied
      if (Database.hasApplied(jobId, req.user.id)) {
        return res.status(400).json({ success: false, message: 'You have already applied for this position.' });
      }

      const newApplication: Application = {
        id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        jobId,
        jobTitle: job.title,
        companyName: job.company,
        employerId: job.employerId,
        applicantId: req.user.id,
        applicantName: req.user.name,
        applicantEmail: req.user.email,
        applicantPhone: phone || req.user.phone,
        applicantHeadline: req.user.headline || 'Job Applicant',
        applicantAvatar: req.user.avatar,
        applicantLocation: req.user.location,
        resumeUrl: resumeUrl || req.user.resumeUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        resumeName: resumeName || req.user.resumeName || `${req.user.name.replace(/\s+/g, '_')}_Resume.pdf`,
        coverLetter: coverLetter || '',
        portfolioUrl: portfolioUrl || req.user.socialLinks?.portfolio,
        status: 'applied',
        appliedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      Database.createApplication(newApplication);

      return res.status(201).json({
        success: true,
        message: 'Application submitted successfully! The hiring team has been notified.',
        application: newApplication
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Error submitting application.' });
    }
  },

  async getMyApplications(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const applications = Database.findApplicationsByApplicant(req.user.id);
      
      // Enrich applications with current job details
      const enriched = applications.map(app => {
        const job = Database.findJobById(app.jobId);
        return {
          ...app,
          job: job || {
            id: app.jobId,
            title: app.jobTitle,
            company: app.companyName,
            location: 'Location not specified',
            jobType: 'Full-time',
            status: 'Closed'
          }
        };
      }).sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());

      return res.json({ success: true, applications: enriched });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Error fetching applications.' });
    }
  },

  async getEmployerApplications(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { jobId, status } = req.query as { jobId?: string; status?: string };

      let applications = req.user.role === 'admin'
        ? Database.getApplications()
        : Database.findApplicationsByEmployer(req.user.id);

      if (jobId && jobId !== 'all') {
        applications = applications.filter(a => a.jobId === jobId);
      }

      if (status && status !== 'all') {
        applications = applications.filter(a => a.status === status);
      }

      // Enrich with applicant full details if available
      const enriched = applications.map(app => {
        const applicant = Database.findUserById(app.applicantId);
        const job = Database.findJobById(app.jobId);
        return {
          ...app,
          job,
          applicant: applicant ? {
            id: applicant.id,
            name: applicant.name,
            email: applicant.email,
            avatar: applicant.avatar,
            skills: applicant.skills,
            experience: applicant.experience,
            education: applicant.education,
            socialLinks: applicant.socialLinks
          } : null
        };
      }).sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());

      return res.json({ success: true, applications: enriched });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Error fetching employer applications.' });
    }
  },

  async updateStatus(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { id } = req.params;
      const { status, notes } = req.body as { status: ApplicationStatus; notes?: string };

      const application = Database.findApplicationById(id);
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found.' });
      }

      // Check permission: employer who owns the job, or admin
      if (application.employerId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden. You do not have permission to update this application.' });
      }

      const updated = Database.updateApplicationStatus(id, status, notes);

      return res.json({
        success: true,
        message: `Application status updated to "${status}".`,
        application: updated
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Error updating application status.' });
    }
  },

  async withdraw(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      const { id } = req.params;
      const app = Database.findApplicationById(id);
      if (!app) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }
      if (app.applicantId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized to withdraw this application' });
      }
      Database.deleteApplication(id);
      return res.json({ success: true, message: 'Application withdrawn successfully' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Error withdrawing application.' });
    }
  }
};
