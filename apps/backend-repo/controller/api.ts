import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import * as userRepo from '../repository/userCollection';
import { User } from '@ebuddy/shared';
import { db } from '../config/firebaseConfig';

export const updateUserData = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.userId || req.user?.uid;
    
    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }
    
    const userData: Partial<User> = req.body;
    
    if (Object.keys(userData).length === 0) {
      res.status(400).json({ error: 'No data provided for update' });
      return;
    }
    
    const existingUser = await userRepo.getUserById(userId);
    
    if (!existingUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
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

export const fetchAllUsers = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string || '10');
    const lastDocId = req.query.lastDocId as string;
    const sortBy = (req.query.sortBy as 'potential' | 'ratings' | 'rents' | 'activity') || 'potential';
    
    let lastDoc;
    if (lastDocId) {
      const docSnapshot = await db.collection('USERS').doc(lastDocId).get();
      if (docSnapshot.exists) {
        lastDoc = docSnapshot;
      }
    }
    
    const { users, lastDoc: newLastDoc } = await userRepo.getAllUsers(
      limit, lastDoc, sortBy
    );
    
    res.status(200).json({ 
      users,
      pagination: {
        hasMore: users.length === limit,
        lastDocId: newLastDoc?.id || null
      }
    });
  } catch (error) {
    console.error('Error in fetchAllUsers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUserActivity = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.uid;
    
    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }
    
    await userRepo.updateUserActivity(userId);
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating user activity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};