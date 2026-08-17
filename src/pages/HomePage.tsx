import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Briefcase,
  Code2,
  Palette,
  Brain,
  Layers,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Users,
  Building2,
  Sparkles,
  Award
} from 'lucide-react';
import { JobCard } from '../components/common/JobCard';
import { JobCardSkeleton } from '../components/common/LoadingSkeleton';
import { Job } from '../types';
import { api } from '../services/api';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [jobsRes, catsRes] = await Promise.all([
          api.getFeaturedJobs(),
          api.getCategories()
        ]);
        setFeaturedJobs(jobsRes.jobs || []);
        setCategories(catsRes.categories || []);
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (locationQuery.trim()) params.append('location', locationQuery.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case 'Software Engineering':
        return <Code2 className="w-6 h-6 text-[#278575]" />;
      case 'Design & Creative':
        return <Palette className="w-6 h-6 text-purple-600" />;
      case 'Data Science & AI':
        return <Brain className="w-6 h-6 text-indigo-600" />;
      case 'Product Management':
        return <Layers className="w-6 h-6 text-amber-600" />;
      case 'DevOps & Cloud':
        return <TrendingUp className="w-6 h-6 text-sky-600" />;
      case 'Security & QA':
        return <ShieldCheck className="w-6 h-6 text-emerald-600" />;
      default:
        return <Briefcase className="w-6 h-6 text-[#278575]" />;
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-linear-to-b from-[#DFF6F0]/50 via-slate-50/80 to-slate-50">
        {/* Subtle decorative background circles */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden opacity-60">
          <div className="absolute top-0 right-10 w-80 h-80 bg-[#6DD5C4]/20 rounded-full blur-3xl" />
          <div className="absolute top-20 left-10 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-teal-200/80 shadow-2xs">
              <Sparkles className="w-4 h-4 text-[#278575]" />
              <span className="text-xs font-semibold text-slate-800">
                Over 2,400+ tech and creative roles added this week
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Find Your Next <span className="text-[#278575]">Opportunity</span> at Top Companies
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Discover verified roles from startups to enterprise leaders. Transparent salaries, one-click applications, and direct communication with hiring teams.
            </p>

            {/* Main Interactive Search Box */}
            <div className="max-w-4xl mx-auto">
              <form
                onSubmit={handleSearchSubmit}
                className="p-3 bg-white rounded-3xl shadow-xl border border-slate-200/90 flex flex-col md:flex-row items-stretch md:items-center gap-2 text-left"
              >
                <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-50/60 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#6DD5C4]/40 border border-transparent focus-within:border-[#6DD5C4] transition-all">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Job title, skills (e.g. React, Product Designer), or keyword"
                    className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>

                <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-50/60 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#6DD5C4]/40 border border-transparent focus-within:border-[#6DD5C4] transition-all">
                  <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={e => setLocationQuery(e.target.value)}
                    placeholder="Lagos, United States, UK, or 'Remote'"
                    className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-2xl bg-brand-primary text-slate-950 font-bold text-sm hover:opacity-90 shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  Find Jobs
                </button>
              </form>

              {/* Quick Location & Category Tags */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Popular Locations:</span>
                {[
                  { label: 'Lagos', value: 'Lagos' },
                  { label: 'United States', value: 'United States' },
                  { label: 'UK', value: 'UK' },
                  { label: 'Remote', value: 'Remote' }
                ].map((loc, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setLocationQuery(loc.value);
                      navigate(`/jobs?location=${encodeURIComponent(loc.value)}`);
                    }}
                    className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-[#6DD5C4] hover:bg-[#DFF6F0]/20 hover:text-slate-900 transition-all cursor-pointer font-medium"
                  >
                    📍 {loc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular tags & CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-500">
              <span className="font-medium text-slate-700">Popular Searches:</span>
              {['Remote Software Engineer', 'UI/UX Designer', 'React Developer', 'Product Manager', 'DevOps'].map((tag, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSearchQuery(tag);
                    navigate(`/jobs?search=${encodeURIComponent(tag)}`);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Dual CTA buttons */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <Link
                to="/jobs"
                className="px-6 py-3 rounded-xl bg-brand-primary text-slate-950 font-bold text-sm hover:opacity-90 shadow-xs transition-all"
              >
                Browse All Openings
              </Link>
              <Link
                to="/employer/post-job"
                className="px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 font-semibold text-sm hover:bg-slate-50 shadow-2xs transition-all"
              >
                Post a Job Listing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Platform Statistics Counter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">12,500+</div>
              <div className="text-xs sm:text-sm font-medium text-slate-500">Active Job Listings</div>
            </div>
            <div className="space-y-1 pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#278575] tracking-tight">4,200+</div>
              <div className="text-xs sm:text-sm font-medium text-slate-500">Verified Companies</div>
            </div>
            <div className="space-y-1 pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">85,000+</div>
              <div className="text-xs sm:text-sm font-medium text-slate-500">Applications Handled</div>
            </div>
            <div className="space-y-1 pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">98%</div>
              <div className="text-xs sm:text-sm font-medium text-slate-500">Hiring Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Popular Job Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#278575]">Explore by Industry</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Popular Job Categories
            </h2>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#278575] hover:text-[#1a584e]"
          >
            Explore all categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={i}
              to={`/jobs?category=${encodeURIComponent(cat.name)}`}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-[#6DD5C4] hover:shadow-md transition-all group flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                {getCategoryIcon(cat.name)}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#1a584e] transition-colors truncate">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{cat.count} open positions</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured Job Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#278575]">Hand-Picked Roles</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Featured Job Opportunities
            </h2>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#278575] hover:text-[#1a584e]"
          >
            View all open listings <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <JobCardSkeleton />
            <JobCardSkeleton />
            <JobCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map(job => (
              <JobCard key={job.id} job={job} featured={job.isFeatured} />
            ))}
          </div>
        )}
      </section>

      {/* 5. How JobBoard Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-r from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-bold uppercase tracking-widest text-[#6DD5C4]">Streamlined Process</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              How JobBoard Works
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Designed to connect candidate talent and hiring teams without friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/60 relative">
              <div className="w-10 h-10 rounded-xl bg-brand-primary text-slate-950 font-bold flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Create Your Profile</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Build your professional portfolio, list skills and experience, and upload your resume for one-click application submission.
              </p>
            </div>

            <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/60 relative">
              <div className="w-10 h-10 rounded-xl bg-brand-primary text-slate-950 font-bold flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Explore & Apply</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Filter verified roles by salary, remote work flexibility, tech stack, and experience level. Submit applications in seconds.
              </p>
            </div>

            <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/60 relative">
              <div className="w-10 h-10 rounded-xl bg-brand-primary text-slate-950 font-bold flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Track & Get Hired</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive transparent status updates from employers (Reviewing, Interview, Offer) directly in your real-time candidate dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="text-xs font-bold uppercase tracking-wider text-[#278575]">Why Choose JobBoard</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              A Platform Built for Quality, Speed, and Trust
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We eliminate fake job posts, ghosting, and non-transparent hiring pipelines by providing tools that empower both candidates and hiring managers.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#278575] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">100% Verified Salary Transparency</h4>
                  <p className="text-xs text-slate-500">Every single job listing includes clear, verified compensation ranges up front.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#278575] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Direct Employer Interaction</h4>
                  <p className="text-xs text-slate-500">Your applications land directly in front of engineering and talent leads.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#278575] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Complete Application Tracking</h4>
                  <p className="text-xs text-slate-500">Live kanban and status updates so you never have to wonder where you stand.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-100 rounded-3xl p-8 border border-slate-200/80 relative">
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Interview Scheduled</div>
                    <div className="text-[11px] text-slate-500">Senior Full Stack Engineer at TechNova</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Active
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-[#278575] flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Profile Viewed by Hiring Manager</div>
                    <div className="text-[11px] text-slate-500">InnovaTech Dynamics reviewed your CV</div>
                  </div>
                </div>
                <span className="text-xs text-slate-400">2h ago</span>
              </div>

              <div className="p-4 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    $
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">High-Match Salary Role</div>
                    <div className="text-[11px] text-slate-500">$160,000 - $210,000 / yr • Remote</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
                  98% Match
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call-To-Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-linear-to-r from-[#DFF6F0] via-teal-50 to-white border border-teal-200 p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Ready to Take the Next Step in Your Career?
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Join thousands of professionals finding rewarding roles, or start hiring qualified talent for your company today.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/jobs"
                className="px-6 py-3 rounded-xl bg-brand-primary text-slate-950 font-bold text-sm hover:opacity-90 shadow-xs transition-all"
              >
                Explore Open Positions
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 font-semibold text-sm hover:bg-slate-50 shadow-2xs transition-all"
              >
                Sign Up for Free
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
