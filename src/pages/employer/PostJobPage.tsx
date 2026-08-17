import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Briefcase,
  Building,
  DollarSign,
  MapPin,
  Calendar,
  Plus,
  Trash2,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Save,
  Layers,
  HelpCircle
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Job, JobCategory, JobType, RemoteType, ExperienceLevel } from '../../types';

const CATEGORIES: JobCategory[] = [
  'Software Engineering',
  'Design & Creative',
  'DevOps & Cloud',
  'Data Science & AI',
  'Product Management',
  'Marketing & Sales',
  'Customer Support',
  'Security & QA',
  'Human Resources',
  'Finance & Legal',
  'Other'
];

const JOB_TYPES: JobType[] = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
const REMOTE_TYPES: RemoteType[] = ['Remote', 'Hybrid', 'On-site'];
const EXPERIENCE_LEVELS: ExperienceLevel[] = ['Entry-level', 'Mid-level', 'Senior', 'Lead', 'Executive'];

const SUGGESTED_BENEFITS = [
  '100% employer-paid health, dental, & vision insurance',
  'Unlimited paid time off (PTO)',
  '401(k) matching up to 5%',
  'Competitive equity & stock options',
  'Remote work home office stipend ($2,000)',
  'Annual learning & conference budget',
  'Paid parental leave (16 weeks)',
  'Wellness & gym membership allowance'
];

export const PostJobPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const { user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingJob, setIsFetchingJob] = useState(isEditing);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<JobCategory>('Software Engineering');
  const [location, setLocation] = useState(user?.location || 'San Francisco, CA');
  const [jobType, setJobType] = useState<JobType>('Full-time');
  const [remoteType, setRemoteType] = useState<RemoteType>('Remote');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Mid-level');
  
  // Salary
  const [salaryMin, setSalaryMin] = useState<string>('120000');
  const [salaryMax, setSalaryMax] = useState<string>('160000');
  const [salaryCurrency, setSalaryCurrency] = useState('USD');
  const [salaryPeriod, setSalaryPeriod] = useState<'year' | 'month' | 'hour'>('year');

  // Description & Lists
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState<string[]>([
    'Architect and implement scalable features for our core web application',
    'Collaborate with cross-functional teams including product, design, and engineering',
    'Participate in code reviews, design docs, and sprint retrospectives'
  ]);
  const [newResp, setNewResp] = useState('');

  const [requirements, setRequirements] = useState<string[]>([
    '3+ years of professional full-stack development experience',
    'Proficiency in React, TypeScript, and modern Node.js backends',
    'Demonstrated passion for UX detail and system reliability'
  ]);
  const [newReq, setNewReq] = useState('');

  const [skills, setSkills] = useState<string[]>(['React', 'TypeScript', 'Node.js', 'Tailwind CSS']);
  const [newSkill, setNewSkill] = useState('');

  const [benefits, setBenefits] = useState<string[]>([
    '100% employer-paid health, dental, & vision insurance',
    'Unlimited paid time off (PTO)',
    '401(k) matching up to 5%'
  ]);
  const [newBenefit, setNewBenefit] = useState('');

  const [deadline, setDeadline] = useState('2026-10-31');
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<'Active' | 'Draft' | 'Closed'>('Active');

  // Load existing job if editing
  useEffect(() => {
    if (id) {
      const fetchJob = async () => {
        try {
          setIsFetchingJob(true);
          const res = await api.getJobById(id);
          const job = res.job;
          setTitle(job.title);
          setCategory(job.category);
          setLocation(job.location);
          setJobType(job.jobType);
          setRemoteType(job.remoteType);
          setExperienceLevel(job.experienceLevel || 'Mid-level');
          setSalaryMin(job.salaryMin ? String(job.salaryMin) : '');
          setSalaryMax(job.salaryMax ? String(job.salaryMax) : '');
          setSalaryCurrency(job.salaryCurrency || 'USD');
          setSalaryPeriod(job.salaryPeriod || 'year');
          setDescription(job.description);
          setResponsibilities(job.responsibilities || []);
          setRequirements(job.requirements || []);
          setSkills(job.skills || []);
          setBenefits(job.benefits || []);
          setDeadline(job.deadline || '');
          setIsFeatured(Boolean(job.isFeatured));
          setStatus((job.status as any) || 'Active');
        } catch (err: any) {
          error(err.message || 'Failed to load job details');
          navigate('/employer/dashboard');
        } finally {
          setIsFetchingJob(false);
        }
      };
      fetchJob();
    }
  }, [id]);

  // Responsibility Handlers
  const addResponsibility = () => {
    if (!newResp.trim()) return;
    setResponsibilities([...responsibilities, newResp.trim()]);
    setNewResp('');
  };

  const removeResponsibility = (idx: number) => {
    setResponsibilities(responsibilities.filter((_, i) => i !== idx));
  };

  // Requirement Handlers
  const addRequirement = () => {
    if (!newReq.trim()) return;
    setRequirements([...requirements, newReq.trim()]);
    setNewReq('');
  };

  const removeRequirement = (idx: number) => {
    setRequirements(requirements.filter((_, i) => i !== idx));
  };

  // Skill Handlers
  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (skills.includes(newSkill.trim())) {
      setNewSkill('');
      return;
    }
    setSkills([...skills, newSkill.trim()]);
    setNewSkill('');
  };

  const removeSkill = (tag: string) => {
    setSkills(skills.filter(s => s !== tag));
  };

  // Benefit Handlers
  const addBenefit = () => {
    if (!newBenefit.trim()) return;
    setBenefits([...benefits, newBenefit.trim()]);
    setNewBenefit('');
  };

  const toggleSuggestedBenefit = (b: string) => {
    if (benefits.includes(b)) {
      setBenefits(benefits.filter(item => item !== b));
    } else {
      setBenefits([...benefits, b]);
    }
  };

  const removeBenefit = (idx: number) => {
    setBenefits(benefits.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      error('Job title is required');
      return;
    }
    if (!description.trim()) {
      error('Job description is required');
      return;
    }

    const payload = {
      title,
      category,
      location,
      jobType,
      remoteType,
      experienceLevel,
      salaryMin: salaryMin ? Number(salaryMin) : undefined,
      salaryMax: salaryMax ? Number(salaryMax) : undefined,
      salaryCurrency,
      salaryPeriod,
      description,
      responsibilities,
      requirements,
      skills,
      benefits,
      deadline,
      isFeatured,
      status: status === 'Draft' ? 'Closed' : status
    };

    try {
      setIsLoading(true);
      if (isEditing && id) {
        await api.updateJob(id, payload);
        success('Job listing updated successfully!');
      } else {
        await api.createJob(payload);
        success('Job listing posted live successfully!');
      }
      navigate('/employer/dashboard');
    } catch (err: any) {
      error(err.message || 'Failed to save job listing');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingJob) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#278575] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-500 font-medium">Loading job details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Navigation & Header */}
      <div>
        <Link
          to="/employer/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Employer Dashboard
        </Link>
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              {isEditing ? 'Edit Job Opening' : 'Post a New Job Opening'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Reach thousands of active developers, designers, and tech professionals
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Posting as:</span>
            <span className="text-xs font-extrabold text-slate-900 bg-slate-100 px-3 py-1 rounded-xl">
              {user?.companyName || 'Your Company'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Job Role Core */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Briefcase className="w-4 h-4 text-[#278575]" /> Job Details & Scope
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Job Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Senior Full Stack Engineer, Staff Product Designer"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as JobCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={e => setExperienceLevel(e.target.value as ExperienceLevel)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
              >
                {EXPERIENCE_LEVELS.map(exp => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Employment Type
              </label>
              <select
                value={jobType}
                onChange={e => setJobType(e.target.value as JobType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
              >
                {JOB_TYPES.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Workplace Setting
              </label>
              <select
                value={remoteType}
                onChange={e => setRemoteType(e.target.value as RemoteType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
              >
                {REMOTE_TYPES.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Location (Office city or Remote boundary)
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA or Worldwide Remote"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
              />
            </div>
          </div>
        </div>

        {/* 2. Compensation & Timeline */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <DollarSign className="w-4 h-4 text-[#278575]" /> Compensation & Application Window
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Minimum Salary
              </label>
              <input
                type="number"
                value={salaryMin}
                onChange={e => setSalaryMin(e.target.value)}
                placeholder="100000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Maximum Salary
              </label>
              <input
                type="number"
                value={salaryMax}
                onChange={e => setSalaryMax(e.target.value)}
                placeholder="150000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Currency
              </label>
              <select
                value={salaryCurrency}
                onChange={e => setSalaryCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD (C$)</option>
                <option value="AUD">AUD (A$)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Pay Rate Frequency
              </label>
              <select
                value={salaryPeriod}
                onChange={e => setSalaryPeriod(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
              >
                <option value="year">Per Year</option>
                <option value="month">Per Month</option>
                <option value="hour">Per Hour</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Application Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="featToggle"
                checked={isFeatured}
                onChange={e => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#278575] focus:ring-[#6DD5C4]"
              />
              <label htmlFor="featToggle" className="text-xs font-bold text-slate-800 cursor-pointer">
                Highlight this listing as a Featured Opening (priority placement in search results)
              </label>
            </div>
          </div>
        </div>

        {/* 3. Description & Detailed Responsibilities */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Layers className="w-4 h-4 text-[#278575]" /> Job Description & Expectations
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Overview Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the team, mission, problem you are solving, and why someone should join..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
            />
          </div>

          {/* Responsibilities List */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Key Responsibilities
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newResp}
                onChange={e => setNewResp(e.target.value)}
                placeholder="Add a core responsibility..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
              />
              <button
                type="button"
                onClick={addResponsibility}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              {responsibilities.map((resp, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800">
                  <span>• {resp}</span>
                  <button
                    type="button"
                    onClick={() => removeResponsibility(idx)}
                    className="text-slate-400 hover:text-rose-600 font-bold ml-2 cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements List */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Qualifications & Requirements
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newReq}
                onChange={e => setNewReq(e.target.value)}
                placeholder="Add a required qualification..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
              />
              <button
                type="button"
                onClick={addRequirement}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              {requirements.map((req, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800">
                  <span>• {req}</span>
                  <button
                    type="button"
                    onClick={() => removeRequirement(idx)}
                    className="text-slate-400 hover:text-rose-600 font-bold ml-2 cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Skills & Benefits */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sparkles className="w-4 h-4 text-[#278575]" /> Skills Tags & Perks
          </h2>

          {/* Skills */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Required Tech Stack & Skills
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                placeholder="e.g. React, Node.js, GraphQL, AWS..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Add Skill
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#DFF6F0] text-[#1a584e] text-xs font-bold border border-teal-200"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-[#278575] hover:text-rose-600 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Benefits & Perks
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {SUGGESTED_BENEFITS.map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleSuggestedBenefit(sug)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                    benefits.includes(sug)
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {benefits.includes(sug) ? '✓ ' : '+ '} {sug}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newBenefit}
                onChange={e => setNewBenefit(e.target.value)}
                placeholder="Add custom benefit..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
              />
              <button
                type="button"
                onClick={addBenefit}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Add Perk
              </button>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            to="/employer/dashboard"
            className="px-5 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3.5 rounded-xl bg-brand-primary text-slate-950 text-xs font-extrabold hover:opacity-90 shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isEditing ? 'Save Job Changes' : 'Publish Job Listing Live'}
          </button>
        </div>
      </form>
    </div>
  );
};
