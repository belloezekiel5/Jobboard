import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  FileText,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  MessageSquare,
  Save,
  ArrowLeft
} from 'lucide-react';
import { Application, ApplicationStatus, Job } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const STATUS_TABS: { label: string; value: string; color: string }[] = [
  { label: 'All Candidates', value: 'all', color: 'bg-slate-100 text-slate-800' },
  { label: 'New Applied', value: 'applied', color: 'bg-blue-100 text-blue-800' },
  { label: 'Reviewing', value: 'reviewing', color: 'bg-amber-100 text-amber-800' },
  { label: 'Interviewing', value: 'interview', color: 'bg-purple-100 text-purple-800' },
  { label: 'Offered / Accepted', value: 'accepted', color: 'bg-emerald-100 text-emerald-800' },
  { label: 'Not Selected', value: 'rejected', color: 'bg-rose-100 text-rose-800' }
];

export const EmployerApplicationsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId') || 'all';

  const { success, error } = useToast();

  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJobId);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Candidate Modal/Drawer
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [internalNotes, setInternalNotes] = useState<string>('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [appRes, jobRes] = await Promise.all([
        api.getEmployerApplications({
          jobId: selectedJobId !== 'all' ? selectedJobId : undefined,
          status: selectedStatus !== 'all' ? selectedStatus : undefined
        }),
        api.getEmployerJobs()
      ]);
      setApplications(appRes.applications || []);
      setJobs(jobRes.jobs || []);
      
      // Auto select first applicant if none selected
      if (appRes.applications && appRes.applications.length > 0 && !selectedApp) {
        setSelectedApp(appRes.applications[0]);
        setInternalNotes(appRes.applications[0].employerNotes || '');
      }
    } catch (err: any) {
      error(err.message || 'Failed to load candidates');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedJobId, selectedStatus]);

  const handleSelectApplicant = (app: Application) => {
    setSelectedApp(app);
    setInternalNotes(app.employerNotes || '');
  };

  const handleUpdateStatus = async (newStatus: ApplicationStatus) => {
    if (!selectedApp) return;
    try {
      setIsUpdatingStatus(true);
      const res = await api.updateApplicationStatus(selectedApp.id, newStatus, internalNotes);
      setApplications(prev =>
        prev.map(a => (a.id === selectedApp.id ? { ...a, status: newStatus, employerNotes: internalNotes } : a))
      );
      setSelectedApp(prev => (prev ? { ...prev, status: newStatus, employerNotes: internalNotes } : null));
      success(`Candidate status updated to "${newStatus}"`);
    } catch (err: any) {
      error(err.message || 'Failed to update candidate status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedApp) return;
    try {
      setIsUpdatingStatus(true);
      await api.updateApplicationStatus(selectedApp.id, selectedApp.status, internalNotes);
      setApplications(prev =>
        prev.map(a => (a.id === selectedApp.id ? { ...a, employerNotes: internalNotes } : a))
      );
      setSelectedApp(prev => (prev ? { ...prev, employerNotes: internalNotes } : null));
      success('Internal hiring notes saved successfully');
    } catch (err: any) {
      error(err.message || 'Failed to save notes');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.applicantName.toLowerCase().includes(q) ||
      app.applicantEmail.toLowerCase().includes(q) ||
      app.jobTitle.toLowerCase().includes(q) ||
      app.applicantHeadline?.toLowerCase().includes(q)
    );
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Candidate Pipeline</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DFF6F0] text-[#1a584e]">
              {applications.length} Total Applicants
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review applicant profiles, evaluate CVs and cover letters, and advance candidates through your hiring stages
          </p>
        </div>

        <Link
          to="/employer/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 self-start md:self-auto"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search candidate name, email, or role..."
              className="w-full pl-9.5 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
            />
          </div>

          {/* Job Filter Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedJobId}
              onChange={e => {
                setSelectedJobId(e.target.value);
                setSearchParams(e.target.value !== 'all' ? { jobId: e.target.value } : {});
              }}
              className="w-full md:w-64 px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
            >
              <option value="all">All Job Postings ({jobs.length})</option>
              {jobs.map(j => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.applicationsCount || 0})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Stage Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setSelectedStatus(tab.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedStatus === tab.value
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split View: Left List, Right Candidate Detail */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-3">
            <div className="h-28 bg-slate-100 rounded-2xl animate-pulse" />
            <div className="h-28 bg-slate-100 rounded-2xl animate-pulse" />
            <div className="h-28 bg-slate-100 rounded-2xl animate-pulse" />
          </div>
          <div className="lg:col-span-7 h-96 bg-slate-100 rounded-3xl animate-pulse" />
        </div>
      ) : filteredApplications.length === 0 ? (
        <EmptyState
          type="applications"
          title="No candidates found"
          description={
            searchQuery || selectedStatus !== 'all' || selectedJobId !== 'all'
              ? 'No applicants match the selected filter criteria. Try clearing search filters.'
              : 'You have not received any candidate applications for this position yet.'
          }
          actionText={selectedJobId !== 'all' || selectedStatus !== 'all' ? 'Reset Filters' : undefined}
          onAction={() => {
            setSelectedJobId('all');
            setSelectedStatus('all');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Candidate List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-bold text-slate-500 px-1">
              Showing {filteredApplications.length} candidate{filteredApplications.length > 1 ? 's' : ''}
            </div>

            {filteredApplications.map(app => {
              const isSelected = selectedApp?.id === app.id;
              return (
                <div
                  key={app.id}
                  onClick={() => handleSelectApplicant(app)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#278575] bg-[#DFF6F0]/20 shadow-xs ring-2 ring-[#6DD5C4]/40'
                      : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={
                        app.applicantAvatar ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(app.applicantName)}`
                      }
                      alt={app.applicantName}
                      className="w-11 h-11 rounded-full object-cover border border-slate-200 bg-white shrink-0"
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-bold text-slate-900 text-sm truncate">{app.applicantName}</h3>
                        <StatusBadge status={app.status} />
                      </div>

                      <div className="text-xs font-medium text-[#278575] truncate mt-0.5">
                        Applied for {app.jobTitle}
                      </div>

                      {app.applicantHeadline && (
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">{app.applicantHeadline}</div>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                        <span>{app.applicantLocation || 'Location not specified'}</span>
                        <span>{formatDate(app.appliedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Candidate Detailed View (7 cols) */}
          <div className="lg:col-span-7">
            {selectedApp ? (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6 sticky top-24">
                {/* Top Profile Summary */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        selectedApp.applicantAvatar ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedApp.applicantName)}`
                      }
                      alt={selectedApp.applicantName}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-extrabold text-slate-900">{selectedApp.applicantName}</h2>
                        <StatusBadge status={selectedApp.status} />
                      </div>
                      <div className="text-xs text-[#278575] font-bold mt-0.5">
                        Applied for: {selectedApp.jobTitle}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Submitted {formatDate(selectedApp.appliedAt)}
                      </div>
                    </div>
                  </div>

                  {/* Resume Download / View */}
                  {selectedApp.resumeUrl && (
                    <a
                      href={selectedApp.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1.5 self-start sm:self-auto shrink-0 shadow-2xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#6DD5C4]" />
                      View CV ({selectedApp.resumeName || 'Resume.pdf'})
                    </a>
                  )}
                </div>

                {/* Status Advancement Actions */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Advance Candidate Stage
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleUpdateStatus('applied')}
                      disabled={isUpdatingStatus || selectedApp.status === 'applied'}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        selectedApp.status === 'applied'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Applied
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('reviewing')}
                      disabled={isUpdatingStatus || selectedApp.status === 'reviewing'}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        selectedApp.status === 'reviewing'
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Under Review
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('interview')}
                      disabled={isUpdatingStatus || selectedApp.status === 'interview'}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        selectedApp.status === 'interview'
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Interview Scheduled
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('accepted')}
                      disabled={isUpdatingStatus || selectedApp.status === 'accepted'}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        selectedApp.status === 'accepted'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Offer Accepted
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('rejected')}
                      disabled={isUpdatingStatus || selectedApp.status === 'rejected'}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        selectedApp.status === 'rejected'
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Not Selected
                    </button>
                  </div>
                </div>

                {/* Contact & Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-700 truncate">{selectedApp.applicantEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-700">{selectedApp.applicantPhone || 'No phone provided'}</span>
                  </div>
                  {selectedApp.portfolioUrl && (
                    <div className="sm:col-span-2 flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <ExternalLink className="w-4 h-4 text-[#278575] shrink-0" />
                      <a
                        href={selectedApp.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#278575] font-semibold hover:underline truncate"
                      >
                        Portfolio: {selectedApp.portfolioUrl}
                      </a>
                    </div>
                  )}
                </div>

                {/* Cover Letter */}
                {selectedApp.coverLetter && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Candidate Cover Note
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                      {selectedApp.coverLetter}
                    </div>
                  </div>
                )}

                {/* Candidate Skills if enriched */}
                {selectedApp.applicant?.skills && selectedApp.applicant.skills.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#278575]" /> Candidate Verified Skills
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedApp.applicant.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-[#DFF6F0] text-[#1a584e] text-xs font-bold"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Internal Hiring Notes */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> Internal Team Notes
                    </label>
                    <button
                      onClick={handleSaveNotes}
                      disabled={isUpdatingStatus}
                      className="text-xs font-bold text-[#278575] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" /> Save Note
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={internalNotes}
                    onChange={e => setInternalNotes(e.target.value)}
                    placeholder="Add interview feedback, salary expectations discussion, or hiring committee notes (visible only to your team)..."
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-400">
                Select a candidate from the left list to review profile and take action.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
