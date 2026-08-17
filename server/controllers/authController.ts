import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Database } from '../config/db.ts';
import { generateToken, AuthRequest } from '../middleware/auth.ts';
import { User, UserRole } from '../models/types.ts';

export const AuthController = {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password, role = 'job_seeker', companyName } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
      }

      if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
      }

      const validRoles: UserRole[] = ['job_seeker', 'employer', 'admin'];
      const userRole: UserRole = validRoles.includes(role) ? role : 'job_seeker';

      const existing = Database.findUserByEmail(email);
      if (existing) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser: User = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        passwordHash,
        role: userRole,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`,
        skills: [],
        experience: [],
        education: [],
        companyName: userRole === 'employer' ? (companyName || `${name.trim()}'s Company`) : undefined,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      Database.createUser(newUser);
      const token = generateToken(newUser);

      // Return sanitized user
      const { passwordHash: _, ...safeUser } = newUser;
      return res.status(201).json({
        success: true,
        message: 'Account created successfully!',
        token,
        user: safeUser
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Failed to register.' });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
      }

      const user = Database.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      if (!user.isActive) {
        return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact support.' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const token = generateToken(user);
      const { passwordHash: _, ...safeUser } = user;

      return res.json({
        success: true,
        message: 'Login successful.',
        token,
        user: safeUser
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Failed to log in.' });
    }
  },

  async demoLogin(req: Request, res: Response) {
    try {
      const { role } = req.body as { role: UserRole };
      let targetEmail = 'seeker@jobboard.com';
      if (role === 'employer') targetEmail = 'employer@jobboard.com';
      if (role === 'admin') targetEmail = 'admin@jobboard.com';

      const user = Database.findUserByEmail(targetEmail);
      if (!user) {
        return res.status(404).json({ success: false, message: `Demo user for role ${role} not found.` });
      }

      const token = generateToken(user);
      const { passwordHash: _, ...safeUser } = user;

      return res.json({
        success: true,
        message: `Logged in as demo ${role.replace('_', ' ')}.`,
        token,
        user: safeUser
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Demo login failed.' });
    }
  },

  async getCurrentUser(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' });
    }
    const { passwordHash: _, ...safeUser } = req.user;
    return res.json({ success: true, user: safeUser });
  }
};
