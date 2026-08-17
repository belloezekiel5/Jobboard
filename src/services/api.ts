import { User, Job, Application, PlatformStats, JobFilters } from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('jobboard_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }
  return data;
}

export const api = {
  // Auth
  async register(payload: { name: string; email: string; password: string; role: string; companyName?: string }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse<{ success: boolean; token: string; user: User; message: string }>(res);
  },

  async login(payload: { email: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse<{ success: boolean; token: string; user: User; message: string }>(res);
  },

  async demoLogin(role: string) {
    const res = await fetch(`${API_BASE}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    return handleResponse<{ success: boolean; token: string; user: User; message: string }>(res);
  },

  async getCurrentUser() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; user: User }>(res);
  },

  // User Profile
  async getProfile() {
    const res = await fetch(`${API_BASE}/users/profile`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; user: User }>(res);
  },

  async updateProfile(updates: Partial<User>) {
    const res = await fetch(`${API_BASE}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    return handleResponse<{ success: boolean; message: string; user: User }>(res);
  },

  async uploadResume(resumeData: { resumeName: string; resumeUrl?: string }) {
    const res = await fetch(`${API_BASE}/users/resume`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(resumeData)
    });
    return handleResponse<{ success: boolean; message: string; user: User }>(res);
  },

  // Jobs
  async getJobs(filters: Partial<JobFilters> = {}) {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.location) params.append('location', filters.location);
    if (filters.jobType && filters.jobType !== 'All') params.append('jobType', filters.jobType);
    if (filters.remoteType && filters.remoteType !== 'All') params.append('remoteType', filters.remoteType);
    if (filters.experienceLevel && filters.experienceLevel !== 'All') params.append('experienceLevel', filters.experienceLevel);
    if (filters.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters.minSalary) params.append('minSalary', filters.minSalary);
    if (filters.maxSalary) params.append('maxSalary', filters.maxSalary);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.page) params.append('page', filters.page.toString());
    params.append('limit', '9');

    const res = await fetch(`${API_BASE}/jobs?${params.toString()}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{
      success: boolean;
      jobs: Job[];
      pagination: { total: number; page: number; limit: number; totalPages: number };
    }>(res);
  },

  async getFeaturedJobs() {
    const res = await fetch(`${API_BASE}/jobs/featured`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; jobs: Job[] }>(res);
  },

  async getCategories() {
    const res = await fetch(`${API_BASE}/jobs/categories`);
    return handleResponse<{ success: boolean; categories: { name: string; count: number }[] }>(res);
  },

  async getJobById(id: string) {
    const res = await fetch(`${API_BASE}/jobs/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; job: Job; similarJobs: Job[] }>(res);
  },

  async createJob(payload: Partial<Job>) {
    const res = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse<{ success: boolean; message: string; job: Job }>(res);
  },

  async updateJob(id: string, payload: Partial<Job>) {
    const res = await fetch(`${API_BASE}/jobs/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse<{ success: boolean; message: string; job: Job }>(res);
  },

  async deleteJob(id: string) {
    const res = await fetch(`${API_BASE}/jobs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  async getEmployerJobs() {
    const res = await fetch(`${API_BASE}/jobs/employer`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; jobs: Job[] }>(res);
  },

  // Applications
  async applyForJob(payload: {
    jobId: string;
    coverLetter?: string;
    resumeUrl?: string;
    resumeName?: string;
    phone?: string;
    portfolioUrl?: string;
  }) {
    const res = await fetch(`${API_BASE}/applications/apply`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse<{ success: boolean; message: string; application: Application }>(res);
  },

  async getMyApplications() {
    const res = await fetch(`${API_BASE}/applications/my-applications`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; applications: Application[] }>(res);
  },

  async getEmployerApplications(filters?: { jobId?: string; status?: string }) {
    const params = new URLSearchParams();
    if (filters?.jobId && filters.jobId !== 'all') params.append('jobId', filters.jobId);
    if (filters?.status && filters.status !== 'all') params.append('status', filters.status);

    const res = await fetch(`${API_BASE}/applications/employer-applications?${params.toString()}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; applications: Application[] }>(res);
  },

  async updateApplicationStatus(id: string, status: string, notes?: string) {
    const res = await fetch(`${API_BASE}/applications/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, notes })
    });
    return handleResponse<{ success: boolean; message: string; application: Application }>(res);
  },

  async withdrawApplication(id: string) {
    const res = await fetch(`${API_BASE}/applications/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  // Saved Jobs
  async saveJob(jobId: string) {
    const res = await fetch(`${API_BASE}/saved-jobs/save`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ jobId })
    });
    return handleResponse<{ success: boolean; message: string; saved: boolean }>(res);
  },

  async unsaveJob(jobId: string) {
    const res = await fetch(`${API_BASE}/saved-jobs/${jobId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; message: string; removed: boolean }>(res);
  },

  async getMySavedJobs() {
    const res = await fetch(`${API_BASE}/saved-jobs`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; savedJobs: (Job & { savedAt: string })[] }>(res);
  },

  // Admin
  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{
      success: boolean;
      stats: PlatformStats;
      recentUsers: User[];
      recentApplications: Application[];
    }>(res);
  },

  async getAdminUsers(params: { search?: string; role?: string; status?: string } = {}) {
    const q = new URLSearchParams();
    if (params.search) q.append('search', params.search);
    if (params.role && params.role !== 'all') q.append('role', params.role);
    if (params.status && params.status !== 'all') q.append('status', params.status);

    const res = await fetch(`${API_BASE}/admin/users?${q.toString()}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; users: User[]; count: number }>(res);
  },

  async updateAdminUserStatus(id: string, updates: { isActive?: boolean; role?: string }) {
    const res = await fetch(`${API_BASE}/admin/users/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    return handleResponse<{ success: boolean; message: string; user: User }>(res);
  },

  async updateAdminUser(id: string, updates: { isActive?: boolean; role?: string }) {
    return this.updateAdminUserStatus(id, updates);
  },

  async deleteAdminUser(id: string) {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  async getAdminJobs(params: { search?: string; status?: string } = {}) {
    const q = new URLSearchParams();
    if (params.search) q.append('search', params.search);
    if (params.status && params.status !== 'all') q.append('status', params.status);

    const res = await fetch(`${API_BASE}/admin/jobs?${q.toString()}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; jobs: Job[] }>(res);
  },

  async updateAdminJob(id: string, payload: Partial<Job>) {
    return this.updateJob(id, payload);
  },

  async deleteAdminJob(id: string) {
    return this.deleteJob(id);
  }
};
