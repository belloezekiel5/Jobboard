import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UploadCloud, CheckCircle2, FileText, Send, Building, Briefcase } from 'lucide-react';
import { Job } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Link } from 'react-router-dom';

interface ApplyModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({ job, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [coverLetter, setCoverLetter] = useState(
    `Dear Hiring Team at ${job?.company || 'the company'},\n\nI am excited to apply for the ${job?.title || 'position'}. With my background in modern software development and passion for high-impact products, I believe I would be a great fit for your team.\n\nLooking forward to the opportunity to discuss further.`
  );
  const [phone, setPhone] = useState(user?.phone || '');
  const [portfolioUrl, setPortfolioUrl] = useState(user?.socialLinks?.portfolio || '');
  const [resumeName, setResumeName] = useState(user?.resumeName || 'My_Latest_Resume.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen || !job) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      error('Please sign in to submit your application.');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.applyForJob({
        jobId: job.id,
        coverLetter,
        phone,
        portfolioUrl,
        resumeName,
        resumeUrl: user.resumeUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      });

      setIsDone(true);
      success('Application submitted successfully!');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      error(err.message || 'Failed to submit application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSimulateResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeName(file.name);
      success(`Selected file: ${file.name}`);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        >
          {/* Header */}
          <div className="p-6 bg-linear-to-r from-slate-50 to-[#DFF6F0]/30 border-b border-slate-200/80 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <img
                src={job.companyLogo || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(job.company)}`}
                alt={job.company}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-white"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">Apply for {job.title}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span className="font-medium text-slate-700 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    {job.company}
                  </span>
                  <span>•</span>
                  <span>{job.location}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 max-h-[75vh] overflow-y-auto">
            {isDone ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Application Sent!</h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                  Your application for <strong>{job.title}</strong> at <strong>{job.company}</strong> has been received. You can monitor your application status in your candidate dashboard.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    Close
                  </button>
                  <Link
                    to="/seeker/dashboard"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-brand-primary text-slate-900 text-sm font-semibold hover:opacity-90 shadow-xs transition-all"
                  >
                    Track in Dashboard
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Candidate Summary */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-sm">
                  <div className="font-semibold text-slate-800">{user?.name}</div>
                  <div className="text-xs text-slate-500">{user?.email}</div>
                </div>

                {/* Phone & Portfolio */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#6DD5C4] focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Portfolio / GitHub URL
                    </label>
                    <input
                      type="url"
                      value={portfolioUrl}
                      onChange={e => setPortfolioUrl(e.target.value)}
                      placeholder="https://myportfolio.dev"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#6DD5C4] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Resume section */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Attached Resume / CV
                  </label>
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-[#DFF6F0] flex items-center justify-center flex-shrink-0 text-[#278575]">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="truncate">
                        <div className="text-sm font-medium text-slate-800 truncate">{resumeName}</div>
                        <div className="text-xs text-slate-500">PDF / DOCX format attached</div>
                      </div>
                    </div>
                    <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors shrink-0">
                      <UploadCloud className="w-3.5 h-3.5" />
                      Change
                      <input type="file" accept=".pdf,.doc,.docx" onChange={handleSimulateResumeUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Cover Letter */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Cover Letter / Note to Hiring Manager
                  </label>
                  <textarea
                    rows={4}
                    value={coverLetter}
                    onChange={e => setCoverLetter(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#6DD5C4] focus:border-transparent transition-all"
                    placeholder="Tell the employer why you are a great match for this position..."
                    required
                  />
                </div>

                {/* Submit button */}
                <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-primary text-slate-900 font-semibold text-sm hover:opacity-90 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Application
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
