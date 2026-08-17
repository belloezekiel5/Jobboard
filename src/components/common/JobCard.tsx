import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, MapPin, Building2, Clock, DollarSign, Sparkles, Check } from 'lucide-react';
import { Job } from '../../types';
import { Badge } from './Badge';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { ApplyModal } from '../modals/ApplyModal';

interface JobCardProps {
  job: Job;
  onBookmarkChange?: (jobId: string, isSaved: boolean) => void;
  featured?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onBookmarkChange, featured = false }) => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [isSaved, setIsSaved] = useState<boolean>(Boolean(job.isSaved));
  const [hasApplied, setHasApplied] = useState<boolean>(Boolean(job.hasApplied));
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);

  const formatSalary = (min: number, max: number, period: string) => {
    if (!min && !max) return 'Competitive Salary';
    const formatNum = (n: number) => (n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`);
    const periodLabel = period === 'year' ? '/yr' : period === 'month' ? '/mo' : '/hr';
    if (min === max) return `${formatNum(min)} ${periodLabel}`;
    return `${formatNum(min)} - ${formatNum(max)} ${periodLabel}`;
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return `${Math.floor(days / 30)}mo ago`;
  };

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setIsSaving(true);
      if (isSaved) {
        await api.unsaveJob(job.id);
        setIsSaved(false);
        if (onBookmarkChange) onBookmarkChange(job.id, false);
        success('Job removed from bookmarks');
      } else {
        await api.saveJob(job.id);
        setIsSaved(true);
        if (onBookmarkChange) onBookmarkChange(job.id, true);
        success('Job saved to bookmarks');
      }
    } catch (err: any) {
      error(err.message || 'Could not update bookmark');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenApply = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    setIsApplyModalOpen(true);
  };

  return (
    <>
      <div
        className={`group relative bg-white rounded-2xl border transition-all duration-200 hover:shadow-md hover:border-[#6DD5C4]/60 flex flex-col justify-between p-6 ${
          featured
            ? 'border-[#6DD5C4]/50 bg-linear-to-b from-[#DFF6F0]/20 to-white ring-1 ring-[#6DD5C4]/20'
            : 'border-slate-200/80 shadow-2xs'
        }`}
      >
        <div>
          {/* Top Row: Company Avatar, Name, Category & Bookmark Button */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <img
                src={job.companyLogo || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(job.company)}`}
                alt={job.company}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-white shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium truncate">
                  <span className="truncate hover:text-slate-800 transition-colors">{job.company}</span>
                  {job.isFeatured && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      <Sparkles className="w-2.5 h-2.5" /> Featured
                    </span>
                  )}
                </div>
                <Link
                  to={`/jobs/${job.id}`}
                  className="block text-base font-bold text-slate-900 group-hover:text-[#1a584e] transition-colors truncate mt-0.5"
                >
                  {job.title}
                </Link>
              </div>
            </div>

            <button
              onClick={handleToggleBookmark}
              disabled={isSaving}
              aria-label={isSaved ? 'Remove bookmark' : 'Bookmark job'}
              className={`p-2 rounded-xl border transition-all shrink-0 cursor-pointer ${
                isSaved
                  ? 'bg-[#DFF6F0] border-[#6DD5C4] text-[#1a584e]'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#1a584e]' : ''}`} />
            </button>
          </div>

          {/* Key Badges & Metadata */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {job.isExternal && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                🌐 {job.externalSource || 'Global'}
              </span>
            )}
            <Badge variant="primary" size="sm">
              {job.jobType}
            </Badge>
            <Badge
              variant={job.remoteType === 'Remote' ? 'success' : job.remoteType === 'Hybrid' ? 'secondary' : 'neutral'}
              size="sm"
            >
              {job.remoteType}
            </Badge>
            <Badge variant="neutral" size="sm">
              {job.experienceLevel}
            </Badge>
          </div>

          {/* Short Description */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {job.description}
          </p>

          {/* Skills tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {job.skills.slice(0, 4).map((skill, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-slate-100/90 text-slate-700 text-[11px] font-medium border border-slate-200/50"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-400 text-[11px] font-medium">
                +{job.skills.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Footer info & action buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-1">
              {formatSalary(job.salaryMin, job.salaryMax, job.salaryPeriod)}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {job.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeAgo(job.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/jobs/${job.id}`}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Details
            </Link>

            {hasApplied ? (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                <Check className="w-3.5 h-3.5" /> Applied
              </span>
            ) : (
              <button
                onClick={handleOpenApply}
                className="px-3.5 py-1.5 rounded-lg bg-brand-primary text-slate-900 text-xs font-bold hover:opacity-90 shadow-2xs transition-all cursor-pointer"
              >
                Apply
              </button>
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
