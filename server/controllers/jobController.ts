import { Request, Response } from 'express';
import { Database } from '../config/db.ts';
import { AuthRequest } from '../middleware/auth.ts';
import { Job, JobType, RemoteType, ExperienceLevel } from '../models/types.ts';
import { GlobalJobService } from '../services/globalJobService.ts';

export const JobController = {
  async getJobs(req: AuthRequest, res: Response) {
    try {
      const {
        search = '',
        location = '',
        jobType,
        remoteType,
        experienceLevel,
        category,
        minSalary,
        maxSalary,
        status = 'Active',
        sort = 'latest',
        page = '1',
        limit = '10'
      } = req.query as Record<string, string>;

      let internalJobs = Database.getJobs();

      // Filter local by status
      if (status !== 'all') {
        internalJobs = internalJobs.filter(j => j.status === status);
      }

      // Keyword search on local jobs
      if (search.trim()) {
        const query = search.trim().toLowerCase();
        internalJobs = internalJobs.filter(j =>
          j.title.toLowerCase().includes(query) ||
          j.company.toLowerCase().includes(query) ||
          j.description.toLowerCase().includes(query) ||
          j.skills.some(s => s.toLowerCase().includes(query)) ||
          j.category.toLowerCase().includes(query)
        );
      }

      // Location filter on local jobs
      if (location.trim()) {
        const locQuery = location.trim().toLowerCase();
        internalJobs = internalJobs.filter(j =>
          j.location.toLowerCase().includes(locQuery) ||
          j.remoteType.toLowerCase().includes(locQuery)
        );
      }

      // Fetch global worldwide jobs from external APIs (JSearch, Adzuna, Jooble, Remotive, Arbeitnow, Gemini)
      let externalJobs: Job[] = [];
      try {
        externalJobs = await GlobalJobService.searchGlobalJobs({
          search: search.trim(),
          location: location.trim(),
          category: category && category !== 'All' ? category : undefined,
          jobType: jobType && jobType !== 'All' ? jobType : undefined,
          remoteType: remoteType && remoteType !== 'All' ? remoteType : undefined,
          experienceLevel: experienceLevel && experienceLevel !== 'All' ? experienceLevel : undefined,
          limit: 25
        });
      } catch (err: any) {
        console.warn('Global jobs fetch non-critical error:', err.message);
      }

      // Merge local and worldwide external jobs without duplicates
      const seenKey = new Set<string>();
      const combinedJobs: Job[] = [];

      for (const job of internalJobs) {
        const key = `${job.title.toLowerCase()}::${job.company.toLowerCase()}`;
        seenKey.add(key);
        combinedJobs.push(job);
      }

      for (const job of externalJobs) {
        const key = `${job.title.toLowerCase()}::${job.company.toLowerCase()}`;
        if (!seenKey.has(key)) {
          seenKey.add(key);
          combinedJobs.push(job);
        }
      }

      let jobs = combinedJobs;

      // Job Type filter
      if (jobType && jobType !== 'All') {
        jobs = jobs.filter(j => j.jobType === jobType);
      }

      // Remote Type filter
      if (remoteType && remoteType !== 'All') {
        jobs = jobs.filter(j => j.remoteType === remoteType);
      }

      // Experience Level filter
      if (experienceLevel && experienceLevel !== 'All') {
        jobs = jobs.filter(j => j.experienceLevel === experienceLevel);
      }

      // Category filter
      if (category && category !== 'All') {
        jobs = jobs.filter(j => j.category.toLowerCase() === category.toLowerCase());
      }

      // Salary Range filter
      if (minSalary) {
        const min = parseInt(minSalary, 10);
        if (!isNaN(min)) {
          jobs = jobs.filter(j => j.salaryMax >= min);
        }
      }
      if (maxSalary) {
        const max = parseInt(maxSalary, 10);
        if (!isNaN(max)) {
          jobs = jobs.filter(j => j.salaryMin <= max);
        }
      }

      // Sorting
      if (sort === 'salary_high') {
        jobs.sort((a, b) => b.salaryMax - a.salaryMax);
      } else if (sort === 'salary_low') {
        jobs.sort((a, b) => a.salaryMin - b.salaryMin);
      } else if (sort === 'views') {
        jobs.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
      } else if (sort === 'applications') {
        jobs.sort((a, b) => (b.applicationsCount || 0) - (a.applicationsCount || 0));
      } else {
        // Default latest
        jobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      const total = jobs.length;
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 10);
      const startIndex = (pageNum - 1) * limitNum;
      const paginatedJobs = jobs.slice(startIndex, startIndex + limitNum);

      // Add user-specific flags if logged in
      const currentUserId = req.user?.id;
      const enrichedJobs = paginatedJobs.map(job => ({
        ...job,
        isSaved: currentUserId ? Database.isJobSaved(currentUserId, job.id) : false,
        hasApplied: currentUserId ? Database.hasApplied(job.id, currentUserId) : false
      }));

      return res.json({
        success: true,
        jobs: enrichedJobs,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        }
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Error fetching jobs' });
    }
  },

  async getFeaturedJobs(req: AuthRequest, res: Response) {
    try {
      const allJobs = Database.getJobs().filter(j => j.status === 'Active');
      const featured = allJobs.filter(j => j.isFeatured).slice(0, 6);
      const fallback = featured.length < 4 ? allJobs.slice(0, 6) : featured;

      const currentUserId = req.user?.id;
      const enriched = fallback.map(job => ({
        ...job,
        isSaved: currentUserId ? Database.isJobSaved(currentUserId, job.id) : false,
        hasApplied: currentUserId ? Database.hasApplied(job.id, currentUserId) : false
      }));

      return res.json({ success: true, jobs: enriched });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Error fetching featured jobs' });
    }
  },

  async getCategories(req: Request, res: Response) {
    try {
      const jobs = Database.getJobs().filter(j => j.status === 'Active');
      const categoryMap: Record<string, number> = {};

      const predefinedCategories = [
        'Software Engineering',
        'Design & Creative',
        'Data Science & AI',
        'Product Management',
        'DevOps & Cloud',
        'Marketing & Sales',
        'Security & QA',
        'Customer Success'
      ];

      predefinedCategories.forEach(cat => {
        categoryMap[cat] = 0;
      });

      jobs.forEach(j => {
        categoryMap[j.category] = (categoryMap[j.category] || 0) + 1;
      });

      const categories = Object.entries(categoryMap).map(([name, count]) => ({
        name,
        count
      }));

      return res.json({ success: true, categories });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Error fetching categories' });
    }
  },

  async getJobById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      let job = Database.findJobById(id);

      // If not in local persistent DB, check GlobalJobService cache
      if (!job) {
        job = GlobalJobService.getJobById(id);
      }

      if (!job) {
        return res.status(404).json({ success: false, message: 'Job listing not found' });
      }

      // Increment view count
      if (Database.findJobById(id)) {
        Database.incrementJobViews(id);
      }

      const currentUserId = req.user?.id;
      const isSaved = currentUserId ? Database.isJobSaved(currentUserId, job.id) : false;
      const hasApplied = currentUserId ? Database.hasApplied(job.id, currentUserId) : false;

      // Also fetch 3 similar jobs
      const similarJobs = Database.getJobs()
        .filter(j => j.id !== id && j.status === 'Active' && (j.category === job!.category || j.employerId === job!.employerId))
        .slice(0, 3)
        .map(j => ({
          ...j,
          isSaved: currentUserId ? Database.isJobSaved(currentUserId, j.id) : false,
          hasApplied: currentUserId ? Database.hasApplied(j.id, currentUserId) : false
        }));

      return res.json({
        success: true,
        job: {
          ...job,
          viewsCount: (job.viewsCount || 0) + 1,
          isSaved,
          hasApplied
        },
        similarJobs
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Error fetching job details' });
    }
  },

  async createJob(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const {
        title,
        company,
        companyLogo,
        companyWebsite,
        companySize,
        companyAbout,
        category,
        location,
        jobType,
        remoteType,
        experienceLevel,
        salaryMin,
        salaryMax,
        salaryCurrency = 'USD',
        salaryPeriod = 'year',
        description,
        responsibilities = [],
        requirements = [],
        skills = [],
        benefits = [],
        deadline,
        isFeatured = false
      } = req.body;

      if (!title || !company || !description || !category || !location || !jobType || !remoteType || !experienceLevel) {
        return res.status(400).json({ success: false, message: 'Please fill in all required job details.' });
      }

      const newJob: Job = {
        id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        employerId: req.user.id,
        employerName: req.user.name,
        employerEmail: req.user.email,
        company: company.trim(),
        companyLogo: companyLogo || req.user.companyLogo || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(company)}`,
        companyWebsite: companyWebsite || req.user.companyWebsite,
        companySize: companySize || req.user.companySize || '50-200 employees',
        companyAbout: companyAbout || req.user.companyDescription,
        title: title.trim(),
        category,
        location: location.trim(),
        jobType: jobType as JobType,
        remoteType: remoteType as RemoteType,
        experienceLevel: experienceLevel as ExperienceLevel,
        salaryMin: Number(salaryMin) || 0,
        salaryMax: Number(salaryMax) || Number(salaryMin) || 0,
        salaryCurrency,
        salaryPeriod,
        description: description.trim(),
        responsibilities: Array.isArray(responsibilities) ? responsibilities.filter(r => r.trim()) : [],
        requirements: Array.isArray(requirements) ? requirements.filter(r => r.trim()) : [],
        skills: Array.isArray(skills) ? skills.filter(s => s.trim()) : [],
        benefits: Array.isArray(benefits) ? benefits.filter(b => b.trim()) : [],
        deadline: deadline || undefined,
        status: 'Active',
        isFeatured: Boolean(isFeatured),
        viewsCount: 0,
        applicationsCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      Database.createJob(newJob);

      return res.status(201).json({
        success: true,
        message: 'Job listing published successfully!',
        job: newJob
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Error creating job listing' });
    }
  },

  async updateJob(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { id } = req.params;
      const existingJob = Database.findJobById(id);

      if (!existingJob) {
        return res.status(404).json({ success: false, message: 'Job listing not found' });
      }

      // Check ownership (or admin)
      if (existingJob.employerId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden. You do not have permission to edit this listing.' });
      }

      const updatedJob = Database.updateJob(id, req.body);
      return res.json({
        success: true,
        message: 'Job listing updated successfully!',
        job: updatedJob
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Error updating job' });
    }
  },

  async deleteJob(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { id } = req.params;
      const existingJob = Database.findJobById(id);

      if (!existingJob) {
        return res.status(404).json({ success: false, message: 'Job listing not found' });
      }

      if (existingJob.employerId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden. You do not have permission to delete this listing.' });
      }

      Database.deleteJob(id);
      return res.json({ success: true, message: 'Job listing deleted successfully.' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Error deleting job' });
    }
  },

  async getEmployerJobs(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const jobs = Database.getJobs()
        .filter(j => j.employerId === req.user!.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return res.json({ success: true, jobs });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Error retrieving employer jobs' });
    }
  }
};
