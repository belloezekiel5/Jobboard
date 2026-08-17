import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight, Home, Briefcase } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#278575] mx-auto">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <div className="text-4xl font-black text-slate-900">404</div>
          <h1 className="text-xl font-extrabold text-slate-900">Page Not Found</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-primary text-slate-950 font-bold text-xs hover:opacity-90 shadow-2xs transition-all flex items-center justify-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" /> Return Home
          </Link>
          <Link
            to="/jobs"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
          >
            <Briefcase className="w-3.5 h-3.5 text-[#278575]" /> Search Jobs
          </Link>
        </div>
      </div>
    </div>
  );
};
