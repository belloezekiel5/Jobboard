import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building,
  Globe,
  Users,
  MapPin,
  Mail,
  Phone,
  Save,
  ArrowLeft,
  Upload,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const EmployerProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { success, error } = useToast();

  const [isSaving, setIsSaving] = useState(false);

  // Company Profile state
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [companyWebsite, setCompanyWebsite] = useState(user?.companyWebsite || '');
  const [companyLogo, setCompanyLogo] = useState(user?.companyLogo || '');
  const [companySize, setCompanySize] = useState(user?.companySize || '50-100 employees');
  const [companyDescription, setCompanyDescription] = useState(user?.companyDescription || '');

  // Representative state
  const [name, setName] = useState(user?.name || '');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      error('Company name is required');
      return;
    }

    try {
      setIsSaving(true);
      await updateUser({
        companyName,
        companyWebsite,
        companyLogo,
        companySize,
        companyDescription,
        name,
        headline,
        phone,
        location
      });
      success('Company profile updated successfully!');
    } catch (err: any) {
      error(err.message || 'Failed to update company profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <Link
          to="/employer/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Company Profile & Branding</h1>
            <p className="text-xs text-slate-500 mt-1">
              Customize how your organization appears on job listings and company spotlights
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 rounded-xl bg-brand-primary text-slate-950 font-bold text-xs hover:opacity-90 shadow-sm transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto disabled:opacity-50"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Company Profile
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. Company Brand Details */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building className="w-4 h-4 text-[#278575]" /> Organization Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="e.g. Acme Cloud Inc."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Official Website
              </label>
              <input
                type="url"
                value={companyWebsite}
                onChange={e => setCompanyWebsite(e.target.value)}
                placeholder="https://company.io"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Company Size / Headcount
              </label>
              <select
                value={companySize}
                onChange={e => setCompanySize(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
              >
                <option value="1-10 employees">1-10 employees (Early Stage)</option>
                <option value="10-50 employees">10-50 employees (Seed / Series A)</option>
                <option value="50-250 employees">50-250 employees (Growth Stage)</option>
                <option value="250-1000 employees">250-1000 employees (Scale-up)</option>
                <option value="1000+ employees">1000+ employees (Enterprise)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Company Logo URL
              </label>
              <div className="flex gap-4 items-center">
                <img
                  src={
                    companyLogo ||
                    `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(companyName || 'Company')}`
                  }
                  alt="Company Logo Preview"
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 bg-white shadow-2xs shrink-0"
                  referrerPolicy="no-referrer"
                />
                <input
                  type="url"
                  value={companyLogo}
                  onChange={e => setCompanyLogo(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                About Company / Mission & Culture
              </label>
              <textarea
                rows={4}
                value={companyDescription}
                onChange={e => setCompanyDescription(e.target.value)}
                placeholder="Explain what your company builds, your tech culture, mission, and why top talent loves working here..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
              />
            </div>
          </div>
        </div>

        {/* 2. Recruiting Representative Details */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Users className="w-4 h-4 text-[#278575]" /> Lead Recruiter / Contact Person
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Contact Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Sarah Chen"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Role / Title
              </label>
              <input
                type="text"
                value={headline}
                onChange={e => setHeadline(e.target.value)}
                placeholder="e.g. Head of Talent Acquisition"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Direct Contact Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Primary Office Location
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Austin, TX"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="text-right">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 rounded-xl bg-brand-primary text-slate-950 font-extrabold text-sm hover:opacity-90 shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> Save Company Profile
          </button>
        </div>
      </form>
    </div>
  );
};
