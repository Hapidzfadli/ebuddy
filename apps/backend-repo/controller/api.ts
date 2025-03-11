import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import * as userRepo from '../repository/userCollection';
import { User } from '@ebuddy/shared';

export const updateUserData = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.userId || req.user?.uid;
    
    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }
    
    const userData: Partial<User> = req.body;
    
    // Validasi data masukan
    if (Object.keys(userData).length === 0) {
      res.status(400).json({ error: 'No data provided for update' });
      return;
    }
    
    // Cek apakah pengguna ada
    const existingUser = await userRepo.getUserById(userId);
    
    if (!existingUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    // Perbarui data pengguna
    const updatedUser = await userRepo.updateUser(userId, userData);
    
    res.status(200).json({ 
      message: 'User data updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error in updateUserData:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const fetchUserData = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.userId || req.user?.uid;
    
    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }
    
    // Cek apakah pengguna ada
    const user = await userRepo.getUserById(userId);
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error in fetchUserData:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const fetchAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await userRepo.getAllUsers();
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error in fetchAllUsers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};