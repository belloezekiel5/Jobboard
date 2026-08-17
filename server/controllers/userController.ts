import { Response } from 'express';
import { Database } from '../config/db.ts';
import { AuthRequest } from '../middleware/auth.ts';

export const UserController = {
  async getProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      const user = Database.findUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      const { passwordHash: _, ...safeUser } = user;
      return res.json({ success: true, user: safeUser });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Error retrieving profile' });
    }
  },

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const allowedUpdates = [
        'name',
        'avatar',
        'phone',
        'location',
        'headline',
        'bio',
        'skills',
        'experience',
        'education',
        'socialLinks',
        'companyName',
        'companyWebsite',
        'companyLogo',
        'companySize',
        'companyDescription',
        'resumeUrl',
        'resumeName'
      ];

      const updates: any = {};
      for (const field of allowedUpdates) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }

      if (updates.resumeUrl && !updates.resumeUpdated) {
        updates.resumeUpdated = new Date().toISOString();
      }

      const updatedUser = Database.updateUser(req.user.id, updates);
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const { passwordHash: _, ...safeUser } = updatedUser;
      return res.json({
        success: true,
        message: 'Profile updated successfully!',
        user: safeUser
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Error updating profile' });
    }
  },

  async uploadResume(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { resumeName = 'Uploaded_Resume.pdf', resumeUrl } = req.body;
      const url = resumeUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

      const updatedUser = Database.updateUser(req.user.id, {
        resumeUrl: url,
        resumeName,
        resumeUpdated: new Date().toISOString()
      });

      if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const { passwordHash: _, ...safeUser } = updatedUser;
      return res.json({
        success: true,
        message: 'Resume attached successfully!',
        user: safeUser
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Error updating resume' });
    }
  },

  async getUserById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const user = Database.findUserById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const { passwordHash: _, ...safeUser } = user;
      return res.json({ success: true, user: safeUser });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Error fetching user' });
    }
  }
};
