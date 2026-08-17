import React from 'react';
import { ApplicationStatus } from '../../types';

interface StatusBadgeProps {
  status: ApplicationStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const normalized = (status || '').toLowerCase();

  switch (normalized) {
    case 'applied':
    case 'pending':
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 ${className}`}
        >
          Applied
        </span>
      );
    case 'reviewing':
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 ${className}`}
        >
          Under Review
        </span>
      );
    case 'interview':
    case 'interviewing':
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200 ${className}`}
        >
          Interview
        </span>
      );
    case 'accepted':
    case 'offered':
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}
        >
          Accepted
        </span>
      );
    case 'rejected':
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 ${className}`}
        >
          Rejected
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 ${className}`}
        >
          {status}
        </span>
      );
  }
};
