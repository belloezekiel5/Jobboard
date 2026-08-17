import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Briefcase,
  Building,
  MapPin,
  ExternalLink,
  Trash2,
  UserCheck,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Application, ApplicationStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const STATUS_FILTERS: { label: string; value: string }[] = [
  { label: 'All Applications', value: 'All' },
  { label: 'Applied', value: 'applied' },
  { label: 'Reviewing', value: 'reviewing' },
  { label: 'Interviewing', value: 'interview' },
  { label: 'Offered / Accepted', value: 'accepted' },
  { label: 'Not Selected', value: 'rejected' }
];

export const SeekerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [applications, setApplications] = useState<Application[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      const res = await api.getMyApplications();
      setApplications(res.applications || []);
    } catch (err: any) {
      error(err.message || 'Could not load your applications.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleWithdraw = async (applicationId: string) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;

    try {
      setWithdrawingId(applicationId);
      await api.withdrawApplication(applicationId);
      success('Application withdrawn successfully');
      setApplications(prev => prev.filter(app => app.id !== applicationId));
    } catch (err: any) {
      error(err.message || 'Failed to withdraw application');
    } finally {
      setWithdrawingId(null);
    }
  };

  const filteredApplications = applications.filter(app => {
    if (statusFilter === 'All') return true;
    return app.status === statusFilter;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'applied').length,
    reviewing: applications.filter(a => a.status === 'reviewing').length,
    interviewing: applications.filter(a => a.status === 'interview').length,
    offered: applications.filter(a => a.status === 'accepted').length
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    return <StatusBadge status={status} />;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile Greeting */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'User')}`}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover border border-slate-200 bg-white shadow-2xs"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">Hello, {user?.name}!</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DFF6F0] text-[#1a584e]">
                Candidate
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {user?.headline || 'Manage your active job applications and track interview schedules'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/seeker/profile"
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Edit Profile & CV
          </Link>
          <Link
            to="/jobs"
            className="px-5 py-2.5 rounded-xl bg-brand-primary text-slate-950 text-xs font-bold hover:opacity-90 shadow-2xs transition-all"
          >
            Explore More Jobs
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Applied</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{stats.total}</div>
          <div className="text-[11px] text-slate-400 mt-1">Active submissions</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">In Review</span>
            <Clock className="w-4 h-4 text-[#278575]" />
          </div>
          <div className="text-3xl font-extrabold text-[#278575] mt-2">{stats.reviewing + stats.pending}</div>
          <div className="text-[11px] text-slate-400 mt-1">Under hiring review</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Interviewing</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-indigo-600 mt-2">{stats.interviewing}</div>
          <div className="text-[11px] text-slate-400 mt-1">Rounds scheduled</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Offers Received</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-2">{stats.offered}</div>
          <div className="text-[11px] text-slate-400 mt-1">Congratulations!</div>
        </div>
      </div>

      {/* Applications Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Submitted Applications</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status updates from employer review teams
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {STATUS_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === f.value
                    ? 'bg-[#DFF6F0] text-[#1a584e] border border-teal-200'
                    : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        {isLoading ? (
          <div className="space-y-4 py-8">
            <div className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
            <div className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
            <div className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
          </div>
        ) : filteredApplications.length === 0 ? (
          <EmptyState
            type="applications"
            title="No applications in this category"
            description="You have not submitted applications matching this status filter yet."
            actionText="Find & Apply for Jobs"
            actionLink="/jobs"
          />
        ) : (
          <div className="space-y-4">
            {filteredApplications.map(app => {
              const job = app.job;
              return (
                <div
                  key={app.id}
                  className="p-5 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xs transition-all bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    {job?.companyLogo ? (
                      <img
                        src={job.companyLogo}
                        alt={job.company}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-white shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                        <Briefcase className="w-6 h-6" />
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/jobs/${app.jobId}`}
                          className="font-bold text-slate-900 text-sm hover:text-[#1a584e] transition-colors"
                        >
                          {job?.title || 'Applied Position'}
                        </Link>
                        {getStatusBadge(app.status)}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="font-medium text-slate-700 flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          {job?.company || 'Company'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {job?.location || 'Location'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Applied on {formatDate(app.createdAt)}
                        </span>
                      </div>

                      {app.coverLetter && (
                        <p className="text-xs text-slate-600 line-clamp-1 italic bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100 mt-2 max-w-xl">
                          "{app.coverLetter}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <Link
                      to={`/jobs/${app.jobId}`}
                      className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1"
                    >
                      View Job <ExternalLink className="w-3 h-3" />
                    </Link>

                    {app.status === 'Pending' && (
                      <button
                        onClick={() => handleWithdraw(app.id)}
                        disabled={withdrawingId === app.id}
                        className="px-3 py-2 rounded-xl border border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Withdraw application"
                      >
                        {withdrawingId === app.id ? 'Withdrawing...' : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
