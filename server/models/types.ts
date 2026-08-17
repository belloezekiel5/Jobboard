export type UserRole = 'job_seeker' | 'employer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  location?: string;
  headline?: string;
  bio?: string;
  skills: string[];
  experience: {
    id: string;
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
  }[];
  education: {
    id: string;
    school: string;
    degree: string;
    fieldOfStudy: string;
    startYear: string;
    endYear?: string;
  }[];
  resumeUrl?: string;
  resumeName?: string;
  resumeUpdated?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    twitter?: string;
  };
  companyName?: string; // For employer
  companyWebsite?: string;
  companyLogo?: string;
  companySize?: string;
  companyDescription?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance';
export type RemoteType = 'Remote' | 'On-site' | 'Hybrid';
export type ExperienceLevel = 'Entry-level' | 'Mid-level' | 'Senior' | 'Lead' | 'Executive';
export type JobStatus = 'Active' | 'Closed' | 'Draft';

export interface Job {
  id: string;
  employerId: string;
  employerName: string;
  employerEmail: string;
  company: string;
  companyLogo?: string;
  companyWebsite?: string;
  companySize?: string;
  companyAbout?: string;
  title: string;
  category: string;
  location: string;
  jobType: JobType;
  remoteType: RemoteType;
  experienceLevel: ExperienceLevel;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  salaryPeriod: 'year' | 'month' | 'hour';
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  benefits: string[];
  deadline?: string;
  status: JobStatus;
  isFeatured: boolean;
  viewsCount: number;
  applicationsCount: number;
  isExternal?: boolean;
  externalSource?: string;
  externalApplyUrl?: string;
  applyType?: 'internal' | 'external';
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus = 'applied' | 'reviewing' | 'interview' | 'accepted' | 'rejected';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  employerId: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  applicantHeadline?: string;
  applicantAvatar?: string;
  applicantLocation?: string;
  resumeUrl?: string;
  resumeName?: string;
  coverLetter?: string;
  portfolioUrl?: string;
  status: ApplicationStatus;
  employerNotes?: string;
  appliedAt: string;
  updatedAt: string;
}

export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  savedAt: string;
}

export interface PlatformStats {
  totalUsers: number;
  totalJobSeekers: number;
  totalEmployers: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  applicationsThisWeek: number;
  topCategories: { category: string; count: number }[];
  recentActivityCount: number;
}
