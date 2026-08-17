import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  Briefcase,
  Layers,
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit,
  Eye,
  BarChart3,
  Activity,
  AlertTriangle,
  UserCheck,
  UserX,
  Sparkles
} from 'lucide-react';
import { User, Job, Application, PlatformStats } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Badge } from '../../components/common/Badge';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'jobs' | 'applications'>('overview');
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [jobsList, setJobsList] = useState<Job[]>([]);
  const [appsList, setAppsList] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [jobSearch, setJobSearch] = useState('');
  const [jobCategoryFilter, setJobCategoryFilter] = useState('all');

  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, usersRes, jobsRes, appsRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers(),
        api.getAdminJobs(),
        api.getEmployerApplications({ jobId: 'all', status: 'all' })
      ]);
      setStats(statsRes.stats);
      setUsersList(usersRes.users || []);
      setJobsList(jobsRes.jobs || []);
      setAppsList(appsRes.applications || []);
    } catch (err: any) {
      error(err.message || 'Failed to load admin management data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // User Actions
  const handleUpdateUserRole = async (userId: string, newRole: 'job_seeker' | 'employer' | 'admin') => {
    try {
      await api.updateAdminUser(userId, { role: newRole });
      setUsersList(prev => prev.map(u => (u.id === userId ? { ...u, role: newRole } : u)));
      success(`User role updated to ${newRole}`);
    } catch (err: any) {
      error(err.message || 'Failed to update user role');
    }
  };

  const handleToggleUserActive = async (u: User) => {
    const newActiveState = u.isActive === false ? true : false;
    try {
      await api.updateAdminUser(u.id, { isActive: newActiveState });
      setUsersList(prev => prev.map(item => (item.id === u.id ? { ...item, isActive: newActiveState } : item)));
      success(`User account ${newActiveState ? 'activated' : 'suspended'}`);
    } catch (err: any) {
      error(err.message || 'Failed to toggle user status');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this user and all associated data?')) return;
    try {
      await api.deleteAdminUser(userId);
      setUsersList(prev => prev.filter(u => u.id !== userId));
      success('User deleted successfully');
    } catch (err: any) {
      error(err.message || 'Failed to delete user');
    }
  };

  // Job Actions
  const handleToggleJobStatus = async (job: Job) => {
    const newStatus = job.status === 'Active' ? 'Closed' : 'Active';
    try {
      await api.updateAdminJob(job.id, { status: newStatus });
      setJobsList(prev => prev.map(j => (j.id === job.id ? { ...j, status: newStatus } : j)));
      success(`Job status changed to ${newStatus}`);
    } catch (err: any) {
      error(err.message || 'Failed to update job');
    }
  };

  const handleToggleJobFeatured = async (job: Job) => {
    const newFeatured = !job.isFeatured;
    try {
      await api.updateAdminJob(job.id, { isFeatured: newFeatured });
      setJobsList(prev => prev.map(j => (j.id === job.id ? { ...j, isFeatured: newFeatured } : j)));
      success(`Job ${newFeatured ? 'marked as featured' : 'unmarked from featured'}`);
    } catch (err: any) {
      error(err.message || 'Failed to toggle featured status');
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!window.confirm('Are you sure you want to permanently remove this job listing?')) return;
    try {
      await api.deleteAdminJob(jobId);
      setJobsList(prev => prev.filter(j => j.id !== jobId));
      success('Job listing removed');
    } catch (err: any) {
      error(err.message || 'Failed to delete job');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Filtered lists
  const filteredUsers = usersList.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.companyName && u.companyName.toLowerCase().includes(userSearch.toLowerCase()));
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredJobs = jobsList.filter(j => {
    const matchesSearch =
      j.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.company.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.location.toLowerCase().includes(jobSearch.toLowerCase());
    const matchesCat = jobCategoryFilter === 'all' || j.category === jobCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-[#6DD5C4]">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight">Platform Control Center</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DFF6F0] text-[#1a584e]">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Global oversight for marketplace moderation, verified users, job inventory, and analytics
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/80">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'overview' ? 'bg-[#6DD5C4] text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'users' ? 'bg-[#6DD5C4] text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            Users ({usersList.length})
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'jobs' ? 'bg-[#6DD5C4] text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            Jobs ({jobsList.length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'applications' ? 'bg-[#6DD5C4] text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            Applications ({appsList.length})
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4 py-8">
          <div className="h-28 bg-slate-100 rounded-3xl animate-pulse" />
          <div className="h-64 bg-slate-100 rounded-3xl animate-pulse" />
        </div>
      ) : (
        <>
          {/* TAB 1: OVERVIEW METRICS */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Accounts</span>
                    <Users className="w-4 h-4 text-[#278575]" />
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 mt-2">{stats?.totalUsers || usersList.length}</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {stats?.totalJobSeekers || 0} Candidates • {stats?.totalEmployers || 0} Employers
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Total Job Openings</span>
                    <Briefcase className="w-4 h-4 text-[#278575]" />
                  </div>
                  <div className="text-3xl font-extrabold text-[#278575] mt-2">{stats?.totalJobs || jobsList.length}</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {stats?.activeJobs || 0} currently active & accepting
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Applications</span>
                    <Layers className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-3xl font-extrabold text-indigo-600 mt-2">
                    {stats?.totalApplications || appsList.length}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    +{stats?.applicationsThisWeek || 0} submitted this week
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">System Health</span>
                    <Activity className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 mt-2">100%</div>
                  <div className="text-[11px] text-emerald-600 font-bold mt-1">Operational & Synced</div>
                </div>
              </div>

              {/* Category Breakdown & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Categories */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#278575]" /> Openings by Industry Category
                  </h3>
                  <div className="space-y-3">
                    {stats?.topCategories?.map((cat, idx) => {
                      const percentage = Math.round((cat.count / (stats?.totalJobs || 1)) * 100);
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs font-bold text-slate-700">
                            <span>{cat.category}</span>
                            <span className="text-slate-500">
                              {cat.count} listings ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full bg-slate-900 rounded-full"
                              style={{ width: `${Math.max(percentage, 8)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Platform Stream */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#278575]" /> Latest Candidate Submissions
                  </h3>
                  <div className="space-y-3">
                    {appsList.slice(0, 5).map(app => (
                      <div
                        key={app.id}
                        className="p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-900">{app.applicantName}</span> applied for{' '}
                          <span className="font-semibold text-[#278575]">{app.jobTitle}</span> at{' '}
                          <span className="font-medium text-slate-600">{app.companyName}</span>
                        </div>
                        <StatusBadge status={app.status} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">User Management</h2>
                  <p className="text-xs text-slate-500">
                    Control roles, view candidate accounts, manage employers, and moderate access
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={userSearch}
                      onChange={e => setUserSearch(e.target.value)}
                      placeholder="Search users..."
                      className="pl-8.5 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
                    />
                  </div>
                  <select
                    value={userRoleFilter}
                    onChange={e => setUserRoleFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="all">All Roles</option>
                    <option value="job_seeker">Job Seekers</option>
                    <option value="employer">Employers</option>
                    <option value="admin">Admins</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Account Status</th>
                      <th className="py-3 px-4">Joined Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                u.avatar ||
                                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name)}`
                              }
                              alt={u.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{u.name}</div>
                              <div className="text-[11px] text-slate-500">{u.email}</div>
                              {u.companyName && (
                                <div className="text-[10px] text-[#278575] font-semibold">{u.companyName}</div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={u.role}
                            onChange={e => handleUpdateUserRole(u.id, e.target.value as any)}
                            className="px-2 py-1 rounded-lg border border-slate-300 text-xs font-semibold bg-white cursor-pointer"
                          >
                            <option value="job_seeker">Job Seeker</option>
                            <option value="employer">Employer</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-4">
                          {u.isActive !== false ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-rose-700 font-bold">
                              <XCircle className="w-3.5 h-3.5" /> Suspended
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-slate-500">{formatDate(u.createdAt)}</td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => handleToggleUserActive(u)}
                              className={`p-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                                u.isActive !== false
                                  ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                                  : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                              }`}
                              title={u.isActive !== false ? 'Suspend User' : 'Activate User'}
                            >
                              {u.isActive !== false ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                            </button>

                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                              title="Delete User Permanently"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: JOBS MODERATION */}
          {activeTab === 'jobs' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">Job Listings Moderation</h2>
                  <p className="text-xs text-slate-500">
                    Review published listings, verify compliance, toggle status, and curate featured posts
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={jobSearch}
                      onChange={e => setJobSearch(e.target.value)}
                      placeholder="Search jobs or company..."
                      className="pl-8.5 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
                    />
                  </div>
                </div>
              </div>

              {/* Jobs List */}
              <div className="space-y-3">
                {filteredJobs.map(job => (
                  <div
                    key={job.id}
                    className="p-4 rounded-2xl border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to={`/jobs/${job.id}`}
                          className="font-bold text-slate-900 text-sm hover:text-[#1a584e]"
                        >
                          {job.title}
                        </Link>
                        <span className="font-semibold text-xs text-[#278575]">• {job.company}</span>
                        {job.status === 'Active' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                            Closed
                          </span>
                        )}
                        {job.isFeatured && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-3">
                        <span>{job.category}</span>
                        <span>•</span>
                        <span>{job.location} ({job.remoteType})</span>
                        <span>•</span>
                        <span>{job.applicationsCount || 0} applicants</span>
                        <span>•</span>
                        <span>Posted by {job.employerName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleJobFeatured(job)}
                        className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                          job.isFeatured
                            ? 'border-amber-300 bg-amber-50 text-amber-800'
                            : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {job.isFeatured ? '★ Featured' : '☆ Feature'}
                      </button>

                      <button
                        onClick={() => handleToggleJobStatus(job)}
                        className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                          job.status === 'Active'
                            ? 'border-slate-300 text-slate-700 hover:bg-slate-50'
                            : 'border-emerald-300 bg-emerald-50 text-emerald-800'
                        }`}
                      >
                        {job.status === 'Active' ? 'Close' : 'Activate'}
                      </button>

                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="p-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: APPLICATIONS STREAM */}
          {activeTab === 'applications' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="text-lg font-extrabold text-slate-900">Platform-Wide Applications</h2>
                <p className="text-xs text-slate-500">
                  Real-time pipeline tracking every job submission across all employers
                </p>
              </div>

              <div className="space-y-3">
                {appsList.map(app => (
                  <div
                    key={app.id}
                    className="p-4 rounded-2xl border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{app.applicantName}</div>
                      <div className="text-slate-500 mt-0.5">
                        Applied for <span className="font-semibold text-slate-800">{app.jobTitle}</span> at{' '}
                        <span className="font-bold text-[#278575]">{app.companyName}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {app.applicantEmail} • Submitted {formatDate(app.appliedAt)}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <StatusBadge status={app.status} />
                      {app.resumeUrl && (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                        >
                          CV
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
