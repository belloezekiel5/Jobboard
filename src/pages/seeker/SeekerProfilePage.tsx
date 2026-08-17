import React, { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  FileText,
  Plus,
  Trash2,
  Save,
  Globe,
  Upload,
  Sparkles,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { UserExperience, UserEducation } from '../../types';

export const SeekerProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { success, error } = useToast();

  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [name, setName] = useState(user?.name || '');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  // Skills
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [newSkill, setNewSkill] = useState('');

  // Experience
  const [experience, setExperience] = useState<UserExperience[]>(user?.experience || []);
  const [newExp, setNewExp] = useState<Partial<UserExperience>>({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });
  const [showAddExp, setShowAddExp] = useState(false);

  // Education
  const [education, setEducation] = useState<UserEducation[]>(user?.education || []);
  const [newEdu, setNewEdu] = useState<Partial<UserEducation>>({
    school: '',
    degree: '',
    fieldOfStudy: '',
    startYear: '',
    endYear: ''
  });
  const [showAddEdu, setShowAddEdu] = useState(false);

  // Resume
  const [resumeName, setResumeName] = useState(user?.resumeName || 'Alex_Morgan_Resume.pdf');
  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');

  // Socials
  const [linkedin, setLinkedin] = useState(user?.socialLinks?.linkedin || '');
  const [github, setGithub] = useState(user?.socialLinks?.github || '');
  const [portfolio, setPortfolio] = useState(user?.socialLinks?.portfolio || '');

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (skills.includes(newSkill.trim())) {
      setNewSkill('');
      return;
    }
    setSkills([...skills, newSkill.trim()]);
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleAddExperience = () => {
    if (!newExp.title || !newExp.company || !newExp.startDate) {
      error('Please fill in title, company, and start date');
      return;
    }
    const expItem: UserExperience = {
      id: `exp_${Date.now()}`,
      title: newExp.title || '',
      company: newExp.company || '',
      location: newExp.location || '',
      startDate: newExp.startDate || '',
      endDate: newExp.current ? undefined : newExp.endDate,
      current: Boolean(newExp.current),
      description: newExp.description || ''
    };
    setExperience([...experience, expItem]);
    setNewExp({
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    });
    setShowAddExp(false);
    success('Experience added');
  };

  const handleRemoveExperience = (id: string) => {
    setExperience(experience.filter(e => e.id !== id));
  };

  const handleAddEducation = () => {
    if (!newEdu.school || !newEdu.degree) {
      error('Please provide school name and degree');
      return;
    }
    const eduItem: UserEducation = {
      id: `edu_${Date.now()}`,
      school: newEdu.school || '',
      degree: newEdu.degree || '',
      fieldOfStudy: newEdu.fieldOfStudy || '',
      startYear: newEdu.startYear || '',
      endYear: newEdu.endYear || ''
    };
    setEducation([...education, eduItem]);
    setNewEdu({
      school: '',
      degree: '',
      fieldOfStudy: '',
      startYear: '',
      endYear: ''
    });
    setShowAddEdu(false);
    success('Education added');
  };

  const handleRemoveEducation = (id: string) => {
    setEducation(education.filter(e => e.id !== id));
  };

  const handleSimulateResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeName(file.name);
      setResumeUrl('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
      success(`Resume "${file.name}" attached successfully!`);
    }
  };

  const handleSaveAll = async () => {
    try {
      setIsSaving(true);
      await updateUser({
        name,
        headline,
        phone,
        location,
        bio,
        avatar,
        skills,
        experience,
        education,
        resumeName,
        resumeUrl,
        resumeUpdated: new Date().toISOString(),
        socialLinks: {
          linkedin,
          github,
          portfolio
        }
      });
    } catch (err: any) {
      error(err.message || 'Failed to save profile changes');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Candidate Profile & CV</h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete your profile information to stand out to hiring managers and enable 1-click applications
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={isSaving}
          className="px-6 py-3 rounded-xl bg-brand-primary text-slate-950 font-bold text-xs hover:opacity-90 shadow-sm transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Profile Changes
        </button>
      </div>

      {/* 1. Basic Information */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <UserIcon className="w-4 h-4 text-[#278575]" /> Personal Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Professional Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={e => setHeadline(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer | React & TypeScript"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Phone Number
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
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="City, State / Remote"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Avatar Image URL
            </label>
            <input
              type="url"
              value={avatar}
              onChange={e => setAvatar(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Professional Summary / Bio
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Briefly describe your career background, core strengths, and what you are looking for..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
            />
          </div>
        </div>
      </div>

      {/* 2. Resume & Portfolio Links */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <FileText className="w-4 h-4 text-[#278575]" /> Resume & External Links
        </h2>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#278575] shadow-2xs">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">{resumeName}</div>
              <div className="text-xs text-slate-500">PDF Document • Ready for 1-click apply</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-white transition-colors flex items-center gap-1"
              >
                View <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <label className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-bold hover:bg-slate-50 shadow-2xs cursor-pointer flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-[#278575]" />
              Upload New CV
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleSimulateResumeUpload} className="sr-only" />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              LinkedIn Profile
            </label>
            <input
              type="url"
              value={linkedin}
              onChange={e => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              GitHub Profile
            </label>
            <input
              type="url"
              value={github}
              onChange={e => setGithub(e.target.value)}
              placeholder="https://github.com/..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Portfolio Website
            </label>
            <input
              type="url"
              value={portfolio}
              onChange={e => setPortfolio(e.target.value)}
              placeholder="https://myportfolio.com"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
            />
          </div>
        </div>
      </div>

      {/* 3. Skills */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Sparkles className="w-4 h-4 text-[#278575]" /> Skills & Technologies
        </h2>

        <form onSubmit={handleAddSkill} className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={e => setNewSkill(e.target.value)}
            placeholder="Add a skill (e.g. React, PostgreSQL, Figma, Docker)..."
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#6DD5C4]"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#6DD5C4]" /> Add
          </button>
        </form>

        <div className="flex flex-wrap gap-2 pt-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#DFF6F0] text-[#1a584e] text-xs font-bold border border-teal-200"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="text-[#278575] hover:text-rose-600 cursor-pointer"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* 4. Work Experience */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#278575]" /> Work Experience
          </h2>
          <button
            onClick={() => setShowAddExp(!showAddExp)}
            className="text-xs font-bold text-[#278575] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> {showAddExp ? 'Cancel' : 'Add Experience'}
          </button>
        </div>

        {showAddExp && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase">New Position</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Job Title (e.g. Senior Frontend Developer)"
                value={newExp.title}
                onChange={e => setNewExp({ ...newExp, title: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              />
              <input
                type="text"
                placeholder="Company Name"
                value={newExp.company}
                onChange={e => setNewExp({ ...newExp, company: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              />
              <input
                type="date"
                placeholder="Start Date"
                value={newExp.startDate}
                onChange={e => setNewExp({ ...newExp, startDate: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              />
              <input
                type="date"
                placeholder="End Date"
                disabled={newExp.current}
                value={newExp.endDate}
                onChange={e => setNewExp({ ...newExp, endDate: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white disabled:opacity-40"
              />
              <div className="sm:col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="currExp"
                  checked={newExp.current}
                  onChange={e => setNewExp({ ...newExp, current: e.target.checked })}
                />
                <label htmlFor="currExp" className="text-xs text-slate-700">I currently work here</label>
              </div>
              <textarea
                rows={3}
                placeholder="Description of responsibilities and achievements..."
                value={newExp.description}
                onChange={e => setNewExp({ ...newExp, description: e.target.value })}
                className="sm:col-span-2 px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              />
            </div>
            <button
              onClick={handleAddExperience}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
            >
              Add to Profile
            </button>
          </div>
        )}

        <div className="space-y-4">
          {experience.map(exp => (
            <div key={exp.id} className="p-4 rounded-2xl border border-slate-200/80 flex items-start justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-slate-900">{exp.title}</h4>
                <div className="text-xs text-[#278575] font-semibold">{exp.company} • {exp.location || 'Remote'}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate || 'N/A'}
                </div>
                {exp.description && (
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{exp.description}</p>
                )}
              </div>
              <button
                onClick={() => handleRemoveExperience(exp.id)}
                className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                title="Remove experience"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Education */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#278575]" /> Education
          </h2>
          <button
            onClick={() => setShowAddEdu(!showAddEdu)}
            className="text-xs font-bold text-[#278575] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> {showAddEdu ? 'Cancel' : 'Add Education'}
          </button>
        </div>

        {showAddEdu && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase">New Education Entry</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="School / University"
                value={newEdu.school}
                onChange={e => setNewEdu({ ...newEdu, school: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              />
              <input
                type="text"
                placeholder="Degree (e.g. Bachelor of Science)"
                value={newEdu.degree}
                onChange={e => setNewEdu({ ...newEdu, degree: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              />
              <input
                type="text"
                placeholder="Field of Study (e.g. Computer Science)"
                value={newEdu.fieldOfStudy}
                onChange={e => setNewEdu({ ...newEdu, fieldOfStudy: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Start Year"
                  value={newEdu.startYear}
                  onChange={e => setNewEdu({ ...newEdu, startYear: e.target.value })}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                />
                <input
                  type="text"
                  placeholder="End Year"
                  value={newEdu.endYear}
                  onChange={e => setNewEdu({ ...newEdu, endYear: e.target.value })}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>
            </div>
            <button
              onClick={handleAddEducation}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
            >
              Add to Profile
            </button>
          </div>
        )}

        <div className="space-y-4">
          {education.map(edu => (
            <div key={edu.id} className="p-4 rounded-2xl border border-slate-200/80 flex items-start justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-slate-900">{edu.school}</h4>
                <div className="text-xs text-[#278575] font-semibold">{edu.degree} in {edu.fieldOfStudy}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{edu.startYear} – {edu.endYear || 'Present'}</div>
              </div>
              <button
                onClick={() => handleRemoveEducation(edu.id)}
                className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                title="Remove education"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button bottom */}
      <div className="text-right">
        <button
          onClick={handleSaveAll}
          disabled={isSaving}
          className="px-8 py-3.5 rounded-xl bg-brand-primary text-slate-950 font-bold text-sm hover:opacity-90 shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> Save Profile & Resume
        </button>
      </div>
    </div>
  );
};
