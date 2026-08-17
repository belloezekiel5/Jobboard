import React from 'react';

export const JobCardSkeleton: React.FC = () => (
  <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs animate-pulse flex flex-col justify-between">
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-slate-200" />
          <div className="space-y-1.5">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-3.5 w-24 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="w-8 h-8 rounded-lg bg-slate-100" />
      </div>
      <div className="h-5 w-3/4 bg-slate-200 rounded" />
      <div className="space-y-2">
        <div className="h-3.5 w-full bg-slate-100 rounded" />
        <div className="h-3.5 w-5/6 bg-slate-100 rounded" />
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        <div className="h-6 w-20 bg-slate-100 rounded-md" />
        <div className="h-6 w-16 bg-slate-100 rounded-md" />
        <div className="h-6 w-24 bg-slate-100 rounded-md" />
      </div>
    </div>
    <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
      <div className="h-4 w-28 bg-slate-200 rounded" />
      <div className="h-9 w-24 bg-slate-200 rounded-lg" />
    </div>
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="divide-y divide-slate-100 animate-pulse">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-200" />
          <div className="space-y-2">
            <div className="h-4 w-40 bg-slate-200 rounded" />
            <div className="h-3 w-28 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="h-6 w-20 bg-slate-100 rounded-full" />
        <div className="h-4 w-24 bg-slate-100 rounded" />
        <div className="h-8 w-20 bg-slate-200 rounded-lg" />
      </div>
    ))}
  </div>
);
