import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  PlusCircle,
  Users,
  Eye,
  TrendingUp,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  ExternalLink,
  Building,
  Clock,
  Sparkles,
  Layers
} from 'lucide-react';
import { Job } from '../../types';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const EmployerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadEmployerData = async () => {
    try {
      setIsLoading(true);
      const res = await api.getEmployerJobs();
      setJobs(res.jobs || []);
    } catch (err: any) {
      error(err.message || 'Failed to load employer dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEmployerData();
  }, []);

  const handleToggleStatus = async (job: Job) => {
    const newStatus = job.status === 'Active' ? 'Closed' : 'Active';
    try {
      await api.updateJob(job.id, { status: newStatus });
      setJobs(prev => prev.map(j => (j.id === job.id ? { ...j, status: newStatus } : j)));
      success(`Job status changed to ${newStatus}`);
    } catch (err: any) {
      error(err.message || 'Failed to update job status');
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this job listing?')) return;

    try {
      setDeletingId(jobId);
      await api.deleteJob(jobId);
      setJobs(prev => prev.filter(j => j.id !== jobId));
      success('Job listing deleted successfully');
    } catch (err: any) {
      error(err.message || 'Failed to delete job');
    } finally {
      setDeletingId(null);
    }
  };

  // Metrics
  const activeJobsCount = jobs.filter(j => j.status === 'Active').length;
  const totalViews = jobs.reduce((acc, j) => acc + (j.viewsCount || 0), 0);
  const totalApplications = jobs.reduce((acc, j) => acc + (j.applicationsCount || 0), 0);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.companyLogo || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(user?.companyName || 'Company')}`}
            alt={user?.companyName || 'Company'}
            className="w-16 h-16 rounded-2xl object-cover border border-slate-200 bg-white shadow-2xs shrink-0"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">
                {user?.companyName || 'Employer Dashboard'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DFF6F0] text-[#1a584e]">
                Hiring Lead
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Manage your company job openings, track candidate analytics, and review applications
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/employer/profile"
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Company Profile
          </Link>
          <Link
            to="/employer/applications"
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-[#278575]" />
            Candidates ({totalApplications})
          </Link>
          <Link
            to="/employer/post-job"
            className="px-5 py-2.5 rounded-xl bg-brand-primary text-slate-950 text-xs font-bold hover:opacity-90 shadow-2xs transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            Post New Job
          </Link>
        </div>
      </div>

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Openings</span>
            <Briefcase className="w-4 h-4 text-[#278575]" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {activeJobsCount} <span className="text-xs font-medium text-slate-400">/ {jobs.length} total</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Live listings accepting applicants</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Total Applications</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-indigo-600 mt-2">{totalApplications}</div>
          <div className="text-[11px] text-slate-400 mt-1">Across all posted positions</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Candidate Views</span>
            <Eye className="w-4 h-4 text-[#278575]" />
          </div>
          <div className="text-3xl font-extrabold text-[#278575] mt-2">{totalViews}</div>
          <div className="text-[11px] text-slate-400 mt-1">Total job impressions</div>
        </div>
      </div>

      {/* Manage Jobs Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Your Job Listings</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Edit descriptions, toggle live visibility, or review candidate submissions
            </p>
          </div>

          <Link
            to="/employer/post-job"
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#6DD5C4]" />
            Post Another Job
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4 py-6">
            <div className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
            <div className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState
            type="jobs"
            title="No job listings posted yet"
            description="Create your first job listing to reach qualified candidates and start accepting applications."
            actionText="Post Your First Job"
            actionLink="/employer/post-job"
          />
        ) : (
          <div className="space-y-4">
            {jobs.map(job => (
              <div
                key={job.id}
                className="p-5 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xs transition-all bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="font-bold text-slate-900 text-base hover:text-[#1a584e] transition-colors"
                    >
                      {job.title}
                    </Link>

                    {job.status === 'Active' ? (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Active & Accepting
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                        Closed / Inactive
                      </span>
                    )}

                    {job.isFeatured && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="font-medium text-slate-700">{job.category}</span>
                    <span>•</span>
                    <span>{job.location} ({job.remoteType})</span>
                    <span>•</span>
                    <span>{job.jobType}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Posted {formatDate(job.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 pt-1">
                    <span className="flex items-center gap-1 text-[#278575]">
                      <Users className="w-3.5 h-3.5" />
                      {job.applicationsCount || 0} Candidates Applied
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Eye className="w-3.5 h-3.5" />
                      {job.viewsCount || 0} Views
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-wrap items-center gap-2 self-start lg:self-center shrink-0">
                  <Link
                    to={`/employer/applications?jobId=${job.id}`}
                    className="px-3.5 py-2 rounded-xl bg-[#DFF6F0] text-[#1a584e] text-xs font-bold hover:bg-[#DFF6F0]/80 transition-colors flex items-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5" />
                    Review Candidates ({job.applicationsCount || 0})
                  </Link>

                  <Link
                    to={`/employer/edit-job/${job.id}`}
                    className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1"
                    title="Edit listing"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </Link>

                  <button
                    onClick={() => handleToggleStatus(job)}
                    className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                      job.status === 'Active'
                        ? 'border-slate-300 text-slate-700 hover:bg-slate-50'
                        : 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    }`}
                  >
                    {job.status === 'Active' ? 'Deactivate' : 'Publish Live'}
                  </button>

                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    disabled={deletingId === job.id}
                    className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
