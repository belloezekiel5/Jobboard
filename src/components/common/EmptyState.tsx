import React from 'react';
import { Briefcase, Search, Bookmark, Users, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  type?: 'search' | 'saved' | 'applications' | 'jobs' | 'users';
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'search',
  title,
  description,
  actionText,
  actionHref,
  onAction
}) => {
  const getIcon = () => {
    switch (type) {
      case 'saved':
        return <Bookmark className="w-8 h-8 text-[#278575]" />;
      case 'applications':
        return <FileText className="w-8 h-8 text-[#278575]" />;
      case 'jobs':
        return <Briefcase className="w-8 h-8 text-[#278575]" />;
      case 'users':
        return <Users className="w-8 h-8 text-[#278575]" />;
      default:
        return <Search className="w-8 h-8 text-[#278575]" />;
    }
  };

  const defaults = {
    search: {
      title: 'No jobs match your search criteria',
      description: 'Try adjusting your filters, searching for broader terms, or clearing all filters.'
    },
    saved: {
      title: 'No saved jobs yet',
      description: 'Bookmark interesting job opportunities while browsing to review and apply to them later.'
    },
    applications: {
      title: 'No job applications submitted yet',
      description: 'Discover relevant career opportunities and start submitting your applications today.'
    },
    jobs: {
      title: 'No job listings found',
      description: 'Get started by creating and publishing your first job listing to attract qualified candidates.'
    },
    users: {
      title: 'No users found',
      description: 'No user accounts match the current query or filter selection.'
    }
  };

  const finalTitle = title || defaults[type].title;
  const finalDesc = description || defaults[type].description;

  return (
    <div className="text-center py-12 px-4 rounded-2xl bg-white border border-dashed border-slate-300 max-w-lg mx-auto my-6">
      <div className="w-16 h-16 rounded-2xl bg-[#DFF6F0] flex items-center justify-center mx-auto mb-4">
        {getIcon()}
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-1.5">{finalTitle}</h3>
      <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">{finalDesc}</p>

      {actionText && actionHref && (
        <Link
          to={actionHref}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-brand-primary text-slate-900 font-semibold text-sm hover:opacity-90 shadow-xs transition-all"
        >
          {actionText}
        </Link>
      )}

      {actionText && !actionHref && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-brand-primary text-slate-900 font-semibold text-sm hover:opacity-90 shadow-xs transition-all cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
