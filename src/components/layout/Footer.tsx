import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Heart, Mail, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-slate-950 font-bold" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Job<span className="text-[#6DD5C4]">Board</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Connecting exceptional developers, designers, and innovators with high-growth companies. Built with modern full-stack architecture.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: For Candidates */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              For Job Seekers
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/jobs" className="hover:text-white transition-colors">
                  Explore All Jobs
                </Link>
              </li>
              <li>
                <Link to="/jobs?remoteType=Remote" className="hover:text-white transition-colors">
                  Remote Opportunities
                </Link>
              </li>
              <li>
                <Link to="/seeker/dashboard" className="hover:text-white transition-colors">
                  Application Tracker
                </Link>
              </li>
              <li>
                <Link to="/seeker/saved" className="hover:text-white transition-colors">
                  Saved Bookmarks
                </Link>
              </li>
              <li>
                <Link to="/seeker/profile" className="hover:text-white transition-colors">
                  Profile & CV Builder
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: For Employers */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              For Employers
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/employer/post-job" className="hover:text-white transition-colors">
                  Post a Job Listing
                </Link>
              </li>
              <li>
                <Link to="/employer/dashboard" className="hover:text-white transition-colors">
                  Employer Console
                </Link>
              </li>
              <li>
                <Link to="/employer/applications" className="hover:text-white transition-colors">
                  Candidate Pipeline
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Hiring Solutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Support */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/jobs?category=Software+Engineering" className="hover:text-white transition-colors">
                  Engineering Roles
                </Link>
              </li>
              <li>
                <Link to="/jobs?category=Design+%26+Creative" className="hover:text-white transition-colors">
                  Design & UX
                </Link>
              </li>
              <li>
                <Link to="/jobs?category=Data+Science+%26+AI" className="hover:text-white transition-colors">
                  AI & Machine Learning
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-white transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} JobBoard Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
