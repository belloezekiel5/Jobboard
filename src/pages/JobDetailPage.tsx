import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  Building,
  MapPin,
  Clock,
  DollarSign,
  Share2,
  CheckCircle2,
  Calendar,
  Globe,
  Users,
  Eye,
  Send,
  Briefcase,
  ExternalLink,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { Job } from '../types';
import { Badge } from '../components/common/Badge';
import { JobCard } from '../components/common/JobCard';
import { ApplyModal } from '../components/modals/ApplyModal';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [similarJobs, setSimilarJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [hasApplied, setHasApplied] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);

  useEffect(() => {
    async function loadJob() {
      if (!id) return;
      try {
        setIsLoading(true);
        const res = await api.getJobById(id);
        setJob(res.job);
        setSimilarJobs(res.similarJobs || []);
        setIsSaved(Boolean(res.job.isSaved));
        setHasApplied(Boolean(res.job.hasApplied));
      } catch (err: any) {
        error(err.message || 'Could not load job listing.');
      } finally {
        setIsLoading(false);
      }
    }
    loadJob();
  }, [id, error]);

  const handleToggleBookmark = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!job) return;

    try {
      setIsSaving(true);
      if (isSaved) {
        await api.unsaveJob(job.id);
        setIsSaved(false);
        success('Removed from bookmarks');
      } else {
        await api.saveJob(job.id);
        setIsSaved(true);
        success('Saved to bookmarks');
      }
    } catch (err: any) {
      error(err.message || 'Error updating bookmark');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      success('Link copied to clipboard!');
    }
  };

  const formatSalary = (min: number, max: number, period: string) => {
    if (!min && !max) return 'Competitive Salary';
    const formatNum = (n: number) => (n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`);
    const periodLabel = period === 'year' ? '/yr' : period === 'month' ? '/mo' : '/hr';
    if (min === max) return `${formatNum(min)} ${periodLabel}`;
    return `${formatNum(min)} - ${formatNum(max)} ${periodLabel}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-6 w-32 bg-slate-200 rounded" />
          <div className="h-40 bg-white rounded-3xl border border-slate-200" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-96 bg-white rounded-3xl border border-slate-200" />
            <div className="h-96 bg-white rounded-3xl border border-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Job Listing Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          This position may have been closed, deleted, or expired.
        </p>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-slate-900 font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Jobs
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb / Back button */}
        <div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Job Search
          </Link>
        </div>

        {/* Hero Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <img
                src={job.companyLogo || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(job.company)}`}
                alt={job.company}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 bg-white shadow-2xs shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-slate-700">{job.company}</span>
                  {job.isExternal && (
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      🌐 {job.externalSource || 'Global Network'}
                    </span>
                  )}
                  {job.isFeatured && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">
                      Featured Role
                    </span>
                  )}
                  {job.status === 'Closed' && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-200 text-slate-700">
                      Position Closed
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {job.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Posted {formatDate(job.createdAt)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    {job.viewsCount || 0} views
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
              <button
                onClick={handleShare}
                className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                title="Share job link"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={handleToggleBookmark}
                disabled={isSaving}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-[#DFF6F0] border-[#6DD5C4] text-[#1a584e]'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title={isSaved ? 'Remove from bookmarks' : 'Save job'}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#1a584e]' : ''}`} />
              </button>

              {hasApplied ? (
                <div className="px-6 py-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Application Submitted
                </div>
              ) : job.status === 'Closed' ? (
                <button
                  disabled
                  className="px-6 py-3 rounded-xl bg-slate-100 text-slate-400 font-bold text-sm cursor-not-allowed"
                >
                  Position Filled / Closed
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (!user) {
                      navigate('/login');
                      return;
                    }
                    setIsApplyModalOpen(true);
                  }}
                  className="px-8 py-3 rounded-xl bg-brand-primary text-slate-950 font-bold text-sm hover:opacity-90 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Apply for this Position
                </button>
              )}
            </div>
          </div>

          {/* Highlights bar */}
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Salary Range</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                {formatSalary(job.salaryMin, job.salaryMax, job.salaryPeriod)}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Employment Type</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{job.jobType}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Workplace Setting</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{job.remoteType}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Experience Level</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{job.experienceLevel}</div>
            </div>
          </div>
        </div>

        {/* Content Layout: Detailed Info + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Description Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About the Role */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-lg font-extrabold text-slate-900">About the Role</h2>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {job.description}
              </div>
            </div>

            {/* Key Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
                <h2 className="text-lg font-extrabold text-slate-900">Key Responsibilities</h2>
                <ul className="space-y-2.5">
                  {job.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-[#278575] shrink-0 mt-1" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements & Qualifications */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
                <h2 className="text-lg font-extrabold text-slate-900">Requirements & Qualifications</h2>
                <ul className="space-y-2.5">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#278575] shrink-0 mt-2" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Required Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
                <h2 className="text-lg font-extrabold text-slate-900">Skills & Tech Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl bg-[#DFF6F0]/70 text-[#1a584e] text-xs font-bold border border-teal-200/50"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits & Perks */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
                <h2 className="text-lg font-extrabold text-slate-900">Benefits & Perks</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {job.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-semibold text-slate-800">
                      <Sparkles className="w-4 h-4 text-[#278575] shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Company Information */}
          <div className="space-y-6">
            {/* Company Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-6">
              <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                <img
                  src={job.companyLogo || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(job.company)}`}
                  alt={job.company}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-white"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{job.company}</h3>
                  <div className="text-xs text-slate-500">{job.location}</div>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Users className="w-3.5 h-3.5" /> Company Size
                  </span>
                  <span className="font-semibold text-slate-800">{job.companySize || '50-250 employees'}</span>
                </div>

                {job.companyWebsite && (
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Globe className="w-3.5 h-3.5" /> Website
                    </span>
                    <a
                      href={job.companyWebsite}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-[#278575] hover:underline flex items-center gap-1"
                    >
                      Visit Site <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {job.deadline && (
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Calendar className="w-3.5 h-3.5" /> Deadline
                    </span>
                    <span className="font-semibold text-slate-800">{formatDate(job.deadline)}</span>
                  </div>
                )}
              </div>

              {job.companyAbout && (
                <div className="pt-4 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-800 mb-1">About {job.company}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{job.companyAbout}</p>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={() => {
                    if (!user) {
                      navigate('/login');
                      return;
                    }
                    setIsApplyModalOpen(true);
                  }}
                  className="w-full py-3 rounded-xl bg-brand-primary text-slate-950 font-bold text-xs hover:opacity-90 shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Quick Apply
                </button>
              </div>
            </div>

            {/* Similar Jobs */}
            {similarJobs.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Similar Job Openings</h3>
                <div className="space-y-3">
                  {similarJobs.map(sim => (
                    <Link
                      key={sim.id}
                      to={`/jobs/${sim.id}`}
                      className="block p-3 rounded-xl border border-slate-200/80 hover:border-[#6DD5C4] hover:bg-[#DFF6F0]/20 transition-all"
                    >
                      <div className="font-bold text-xs text-slate-900 truncate">{sim.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{sim.company} • {sim.location}</div>
                      <div className="text-[11px] font-semibold text-[#278575] mt-1">
                        {formatSalary(sim.salaryMin, sim.salaryMax, sim.salaryPeriod)}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ApplyModal
        job={job}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={() => setHasApplied(true)}
      />
    </>
  );
};
