import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, ArrowRight, Trash2, Building, MapPin, DollarSign, Clock } from 'lucide-react';
import { Job } from '../../types';
import { EmptyState } from '../../components/common/EmptyState';
import { JobCard } from '../../components/common/JobCard';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const SavedJobsPage: React.FC = () => {
  const [savedJobs, setSavedJobs] = useState<(Job & { savedAt: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { success, error } = useToast();

  const loadSavedJobs = async () => {
    try {
      setIsLoading(true);
      const res = await api.getMySavedJobs();
      setSavedJobs(res.savedJobs || []);
    } catch (err: any) {
      error(err.message || 'Failed to load saved jobs.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const handleRemove = async (jobId: string) => {
    try {
      await api.unsaveJob(jobId);
      setSavedJobs(prev => prev.filter(j => j.id !== jobId));
      success('Job removed from saved list');
    } catch (err: any) {
      error(err.message || 'Failed to remove saved job');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Saved Jobs</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DFF6F0] text-[#1a584e]">
              {savedJobs.length} Bookmarked
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Keep track of open positions you are interested in and apply whenever you're ready
          </p>
        </div>

        <Link
          to="/jobs"
          className="px-5 py-2.5 rounded-xl bg-brand-primary text-slate-950 text-xs font-bold hover:opacity-90 shadow-2xs transition-all inline-flex items-center gap-2 self-start md:self-auto"
        >
          Discover More Jobs <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-100 rounded-3xl animate-pulse" />
          <div className="h-64 bg-slate-100 rounded-3xl animate-pulse" />
          <div className="h-64 bg-slate-100 rounded-3xl animate-pulse" />
        </div>
      ) : savedJobs.length === 0 ? (
        <EmptyState
          type="saved"
          title="No saved jobs yet"
          description="Browse available job openings and click the bookmark icon on any card to save positions for later."
          actionText="Browse Open Jobs"
          actionLink="/jobs"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map(job => (
            <div key={job.id} className="relative group">
              <JobCard job={job} featured={job.isFeatured} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
