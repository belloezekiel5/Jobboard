import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  MapPin,
  Filter,
  X,
  SlidersHorizontal,
  DollarSign,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Job, JobFilters } from '../types';
import { JobCard } from '../components/common/JobCard';
import { JobCardSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { api } from '../services/api';

const JOB_TYPES = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
const REMOTE_TYPES = ['All', 'Remote', 'Hybrid', 'On-site'];
const EXPERIENCE_LEVELS = ['All', 'Entry-level', 'Mid-level', 'Senior', 'Lead', 'Executive'];
const CATEGORIES = [
  'All',
  'Software Engineering',
  'Design & Creative',
  'Data Science & AI',
  'Product Management',
  'DevOps & Cloud',
  'Marketing & Sales',
  'Security & QA'
];

export const JobsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters State initialized from URL query params
  const [search, setSearch] = useState<string>(searchParams.get('search') || '');
  const [location, setLocation] = useState<string>(searchParams.get('location') || '');
  const [jobType, setJobType] = useState<string>(searchParams.get('jobType') || 'All');
  const [remoteType, setRemoteType] = useState<string>(searchParams.get('remoteType') || 'All');
  const [experienceLevel, setExperienceLevel] = useState<string>(searchParams.get('experienceLevel') || 'All');
  const [category, setCategory] = useState<string>(searchParams.get('category') || 'All');
  const [minSalary, setMinSalary] = useState<string>(searchParams.get('minSalary') || '');
  const [maxSalary, setMaxSalary] = useState<string>(searchParams.get('maxSalary') || '');
  const [sort, setSort] = useState<string>(searchParams.get('sort') || 'latest');
  const [page, setPage] = useState<number>(parseInt(searchParams.get('page') || '1', 10));

  const [jobs, setJobs] = useState<Job[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 9, totalPages: 1 });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Sync state with URL params
  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      const filters: Partial<JobFilters> = {
        search,
        location,
        jobType,
        remoteType,
        experienceLevel,
        category,
        minSalary,
        maxSalary,
        sort,
        page
      };

      const res = await api.getJobs(filters);
      setJobs(res.jobs || []);
      setPagination(res.pagination || { total: 0, page: 1, limit: 9, totalPages: 1 });
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setIsLoading(false);
    }
  }, [search, location, jobType, remoteType, experienceLevel, category, minSalary, maxSalary, sort, page]);

  useEffect(() => {
    fetchJobs();

    // Update query params in URL
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (location) params.set('location', location);
    if (jobType !== 'All') params.set('jobType', jobType);
    if (remoteType !== 'All') params.set('remoteType', remoteType);
    if (experienceLevel !== 'All') params.set('experienceLevel', experienceLevel);
    if (category !== 'All') params.set('category', category);
    if (minSalary) params.set('minSalary', minSalary);
    if (maxSalary) params.set('maxSalary', maxSalary);
    if (sort !== 'latest') params.set('sort', sort);
    if (page > 1) params.set('page', page.toString());

    setSearchParams(params, { replace: true });
  }, [fetchJobs, search, location, jobType, remoteType, experienceLevel, category, minSalary, maxSalary, sort, page, setSearchParams]);

  const handleResetFilters = () => {
    setSearch('');
    setLocation('');
    setJobType('All');
    setRemoteType('All');
    setExperienceLevel('All');
    setCategory('All');
    setMinSalary('');
    setMaxSalary('');
    setSort('latest');
    setPage(1);
  };

  const hasActiveFilters =
    search ||
    location ||
    jobType !== 'All' ||
    remoteType !== 'All' ||
    experienceLevel !== 'All' ||
    category !== 'All' ||
    minSalary ||
    maxSalary;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Search & Discovery Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
          }}
          className="flex flex-col lg:flex-row gap-3"
        >
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/60 focus-within:bg-white focus-within:border-[#6DD5C4] focus-within:ring-2 focus-within:ring-[#6DD5C4]/30 transition-all">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by job title, skill tags, or company..."
              className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {search && (
              <button type="button" onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/60 focus-within:bg-white focus-within:border-[#6DD5C4] focus-within:ring-2 focus-within:ring-[#6DD5C4]/30 transition-all">
            <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={location}
              onChange={e => {
                setLocation(e.target.value);
                setPage(1);
              }}
              placeholder="Lagos, United States, UK, or 'Remote'"
              className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {location && (
              <button type="button" onClick={() => setLocation('')} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 lg:flex-none px-6 py-3 rounded-2xl bg-brand-primary text-slate-950 font-bold text-sm hover:opacity-90 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" />
              Find Jobs
            </button>

            {/* Mobile filter toggle */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters {hasActiveFilters && '•'}
            </button>
          </div>
        </form>

        {/* Quick location filter chips */}
        <div className="flex flex-wrap items-center gap-2 pt-3 mt-2 border-t border-slate-100 text-xs text-slate-500">
          <span className="font-medium text-slate-700">Quick Locations:</span>
          {['Lagos', 'United States', 'UK', 'Remote'].map((locName) => (
            <button
              key={locName}
              type="button"
              onClick={() => {
                setLocation(location === locName ? '' : locName);
                setPage(1);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                location.toLowerCase() === locName.toLowerCase()
                  ? 'bg-[#DFF6F0] border-[#6DD5C4] text-[#1a584e] font-semibold'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              📍 {locName}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Listings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Filter className="w-4 h-4 text-[#278575]" />
              Filter Jobs
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Category
            </label>
            <select
              value={category}
              onChange={e => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
            >
              {CATEGORIES.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Job Type Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Employment Type
            </label>
            <div className="space-y-1.5">
              {JOB_TYPES.map(type => (
                <label
                  key={type}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    jobType === type
                      ? 'bg-[#DFF6F0] text-[#1a584e] font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="jobType"
                    checked={jobType === type}
                    onChange={() => {
                      setJobType(type);
                      setPage(1);
                    }}
                    className="sr-only"
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Remote / Workplace Type */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Workplace Setting
            </label>
            <div className="space-y-1.5">
              {REMOTE_TYPES.map(type => (
                <label
                  key={type}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    remoteType === type
                      ? 'bg-[#DFF6F0] text-[#1a584e] font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="remoteType"
                    checked={remoteType === type}
                    onChange={() => {
                      setRemoteType(type);
                      setPage(1);
                    }}
                    className="sr-only"
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Experience Level
            </label>
            <select
              value={experienceLevel}
              onChange={e => {
                setExperienceLevel(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
            >
              {EXPERIENCE_LEVELS.map((lvl, i) => (
                <option key={i} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* Minimum Salary Slider/Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Minimum Salary ($/yr)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={minSalary}
                onChange={e => {
                  setMinSalary(e.target.value);
                  setPage(1);
                }}
                placeholder="Min ($)"
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
              />
              <input
                type="number"
                value={maxSalary}
                onChange={e => {
                  setMaxSalary(e.target.value);
                  setPage(1);
                }}
                placeholder="Max ($)"
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
              />
            </div>
          </div>
        </aside>

        {/* Listings Section */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header row: count & sort options */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900">
                  Discover Jobs
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  🌐 Worldwide Search Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing <span className="font-bold text-slate-800">{jobs.length}</span> of{' '}
                <span className="font-bold text-slate-800">{pagination.total}</span> available positions worldwide
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs text-slate-500 font-medium">Sort by:</span>
              <select
                value={sort}
                onChange={e => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
              >
                <option value="latest">Latest Posted</option>
                <option value="salary_high">Salary: High to Low</option>
                <option value="salary_low">Salary: Low to High</option>
                <option value="views">Most Viewed</option>
                <option value="applications">Most Applied</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400">Active filters:</span>
              {search && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#DFF6F0] text-[#1a584e] text-xs font-medium">
                  Search: {search}
                  <button onClick={() => setSearch('')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {location && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#DFF6F0] text-[#1a584e] text-xs font-medium">
                  Location: {location}
                  <button onClick={() => setLocation('')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {jobType !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#DFF6F0] text-[#1a584e] text-xs font-medium">
                  {jobType}
                  <button onClick={() => setJobType('All')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {remoteType !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#DFF6F0] text-[#1a584e] text-xs font-medium">
                  {remoteType}
                  <button onClick={() => setRemoteType('All')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {category !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#DFF6F0] text-[#1a584e] text-xs font-medium">
                  {category}
                  <button onClick={() => setCategory('All')}><X className="w-3 h-3" /></button>
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs text-rose-600 hover:underline font-semibold ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Listings Feed */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <JobCardSkeleton />
              <JobCardSkeleton />
              <JobCardSkeleton />
              <JobCardSkeleton />
              <JobCardSkeleton />
              <JobCardSkeleton />
            </div>
          ) : jobs.length === 0 ? (
            <EmptyState
              type="search"
              title="No matching job listings found"
              description="Try modifying your keyword search, clearing location criteria, or expanding the salary filters."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map(job => (
                <JobCard key={job.id} job={job} featured={job.isFeatured} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              <button
                disabled={page <= 1}
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: pagination.totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                      page === pageNum
                        ? 'bg-brand-primary text-slate-900 shadow-xs'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(prev => Math.min(pagination.totalPages, prev + 1))}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Filters</h3>
              <button onClick={() => setIsMobileFilterOpen(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm"
                >
                  {CATEGORIES.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Job Type</label>
                <select
                  value={jobType}
                  onChange={e => setJobType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm"
                >
                  {JOB_TYPES.map((t, i) => (
                    <option key={i} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Workplace Setting</label>
                <select
                  value={remoteType}
                  onChange={e => setRemoteType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm"
                >
                  {REMOTE_TYPES.map((r, i) => (
                    <option key={i} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-3">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-brand-primary text-slate-900 text-xs font-bold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
