import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Briefcase,
  Search,
  PlusCircle,
  Bookmark,
  FileText,
  User,
  LogOut,
  Shield,
  Menu,
  X,
  ChevronDown,
  Layers,
  Building,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleLabel = () => {
    if (!user) return '';
    if (user.role === 'admin') return 'Admin';
    if (user.role === 'employer') return 'Employer';
    return 'Job Seeker';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5 text-slate-950 font-bold" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                  Job<span className="text-[#278575]">Board</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wide">
                  Career Marketplace
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/jobs"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/jobs'
                    ? 'text-[#1a584e] bg-[#DFF6F0]/60 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Find Jobs
              </Link>

              {user?.role === 'job_seeker' && (
                <>
                  <Link
                    to="/seeker/dashboard"
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === '/seeker/dashboard'
                        ? 'text-[#1a584e] bg-[#DFF6F0]/60 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    My Applications
                  </Link>
                  <Link
                    to="/seeker/saved"
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === '/seeker/saved'
                        ? 'text-[#1a584e] bg-[#DFF6F0]/60 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Saved Jobs
                  </Link>
                </>
              )}

              {user?.role === 'employer' && (
                <>
                  <Link
                    to="/employer/dashboard"
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === '/employer/dashboard'
                        ? 'text-[#1a584e] bg-[#DFF6F0]/60 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Employer Dashboard
                  </Link>
                  <Link
                    to="/employer/applications"
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === '/employer/applications'
                        ? 'text-[#1a584e] bg-[#DFF6F0]/60 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Candidates
                  </Link>
                </>
              )}

              {user?.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === '/admin/dashboard'
                      ? 'text-[#1a584e] bg-[#DFF6F0]/60 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Admin Console
                </Link>
              )}
            </nav>
          </div>

          {/* Right Side CTAs & Auth Menu */}
          <div className="flex items-center gap-3">
            {/* Employer CTA: Post a Job */}
            {(!user || user.role === 'employer' || user.role === 'admin') && (
              <Link
                to="/employer/post-job"
                className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
              >
                <PlusCircle className="w-4 h-4 text-[#6DD5C4]" />
                Post a Job
              </Link>
            )}

            {/* Auth state */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    className="w-9 h-9 rounded-lg object-cover border border-slate-200 bg-white"
                    referrerPolicy="no-referrer"
                  />
                  <div className="hidden md:block text-left">
                    <div className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-slate-500 capitalize">{getRoleLabel()}</div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#DFF6F0] text-[#1a584e]">
                        {getRoleLabel()} Account
                      </div>
                    </div>

                    <div className="py-1">
                      {user.role === 'job_seeker' && (
                        <>
                          <Link
                            to="/seeker/dashboard"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          >
                            <FileText className="w-4 h-4 text-slate-400" />
                            Applications Tracker
                          </Link>
                          <Link
                            to="/seeker/saved"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          >
                            <Bookmark className="w-4 h-4 text-slate-400" />
                            Bookmarked Jobs
                          </Link>
                          <Link
                            to="/seeker/profile"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          >
                            <User className="w-4 h-4 text-slate-400" />
                            Edit Profile & Resume
                          </Link>
                        </>
                      )}

                      {user.role === 'employer' && (
                        <>
                          <Link
                            to="/employer/dashboard"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          >
                            <Briefcase className="w-4 h-4 text-slate-400" />
                            Employer Dashboard
                          </Link>
                          <Link
                            to="/employer/applications"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          >
                            <Users className="w-4 h-4 text-slate-400" />
                            Review Applications
                          </Link>
                          <Link
                            to="/employer/post-job"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          >
                            <PlusCircle className="w-4 h-4 text-slate-400" />
                            Post New Job
                          </Link>
                        </>
                      )}

                      {user.role === 'admin' && (
                        <>
                          <Link
                            to="/admin/dashboard"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          >
                            <Shield className="w-4 h-4 text-slate-400" />
                            Admin Overview
                          </Link>
                          <Link
                            to="/jobs"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          >
                            <Layers className="w-4 h-4 text-slate-400" />
                            All Job Listings
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-brand-primary text-slate-900 text-xs font-bold hover:opacity-90 shadow-2xs transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="space-y-1">
            <Link
              to="/jobs"
              className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Find Jobs
            </Link>

            {user?.role === 'job_seeker' && (
              <>
                <Link
                  to="/seeker/dashboard"
                  className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  My Applications Tracker
                </Link>
                <Link
                  to="/seeker/saved"
                  className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Saved Jobs
                </Link>
                <Link
                  to="/seeker/profile"
                  className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  My Profile & Resume
                </Link>
              </>
            )}

            {user?.role === 'employer' && (
              <>
                <Link
                  to="/employer/dashboard"
                  className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Employer Dashboard
                </Link>
                <Link
                  to="/employer/applications"
                  className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Manage Candidates
                </Link>
                <Link
                  to="/employer/post-job"
                  className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Post a New Job
                </Link>
              </>
            )}

            {user?.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Admin Console
              </Link>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100 cursor-pointer"
              >
                Sign Out ({user.name})
              </button>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/employer/post-job"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  <PlusCircle className="w-4 h-4 text-[#6DD5C4]" />
                  Post a Job Listing
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    className="flex items-center justify-center py-2.5 px-4 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center justify-center py-2.5 px-4 rounded-xl bg-brand-primary text-slate-900 text-xs font-bold hover:opacity-90"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
