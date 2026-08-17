import { Response } from 'express';
import { Database } from '../config/db.ts';
import { AuthRequest } from '../middleware/auth.ts';

export const AdminController = {
  async getStats(req: AuthRequest, res: Response) {
    try {
      const stats = Database.getPlatformStats();
      const recentUsers = Database.getUsers()
        .slice(-5)
        .reverse()
        .map(({ passwordHash: _, ...safe }) => safe);

      const recentApplications = Database.getApplications().slice(0, 5);

      return res.json({
        success: true,
        stats,
        recentUsers,
        recentApplications
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Error fetching admin stats.' });
    }
  },

  async getAllUsers(req: AuthRequest, res: Response) {
    try {
      const { search = '', role = 'all', status = 'all' } = req.query as { search?: string; role?: string; status?: string };

      let users = Database.getUsers();

      if (search.trim()) {
        const q = search.trim().toLowerCase();
        users = users.filter(u =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.companyName && u.companyName.toLowerCase().includes(q))
        );
      }

      if (role !== 'all') {
        users = users.filter(u => u.role === role);
      }

      if (status !== 'all') {
        const isActive = status === 'active';
        users = users.filter(u => u.isActive === isActive);
      }

      const safeUsers = users.map(({ passwordHash: _, ...safe }) => safe);
      return res.json({ success: true, users: safeUsers, count: safeUsers.length });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Error fetching users.' });
    }
  },

  async updateUserStatus(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { isActive, role } = req.body;

      const updates: any = {};
      if (isActive !== undefined) updates.isActive = Boolean(isActive);
      if (role) updates.role = role;

      const updated = Database.updateUser(id, updates);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      const { passwordHash: _, ...safeUser } = updated;
      return res.json({
        success: true,
        message: 'User status updated successfully.',
        user: safeUser
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Error updating user.' });
    }
  },

  async deleteUser(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      if (req.user?.id === id) {
        return res.status(400).json({ success: false, message: 'You cannot delete your own admin account.' });
      }

      const deleted = Database.deleteUser(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      return res.json({ success: true, message: 'User and associated data removed permanently.' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Error deleting user.' });
    }
  },

  async getAllJobsModeration(req: AuthRequest, res: Response) {
    try {
      const { search = '', status = 'all' } = req.query as { search?: string; status?: string };
      let jobs = Database.getJobs();

      if (search.trim()) {
        const q = search.trim().toLowerCase();
        jobs = jobs.filter(j =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.employerEmail.toLowerCase().includes(q)
        );
      }

      if (status !== 'all') {
        jobs = jobs.filter(j => j.status === status);
      }

      return res.json({ success: true, jobs });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Error fetching jobs for moderation.' });
    }
  }
};
