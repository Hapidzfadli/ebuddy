import { db } from '../config/firebaseConfig';
import { User } from '@ebuddy/shared';

const COLLECTION_NAME = 'USERS';

export const getUserById = async (userId: string): Promise<User | null> => {
    try {
        const userDoc = await db.collection(COLLECTION_NAME).doc(userId).get();

        if(!userDoc.exists){
            return null;
        }

        return {id: userDoc.id, ...userDoc.data()} as User;
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw error;
    }
}

export const updateUser = async(userId: string, userData : Partial<User>) : Promise<User> => {
    try {
        const now = Date.now();
        const updatedData = {
          ...userData,
          updatedAt: now,
          recentlyActive: now
        };

        await db.collection(COLLECTION_NAME).doc(userId).update(updatedData);

        const updatedUser = await getUserById(userId);

        if (!updatedUser) {
            throw new Error('User not found after update');
        }
        
        return updatedUser;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}


export const createUser = async (userData: User) : Promise<User> => {
    try {
        const now = Date.now();

        const newUserData = {
        ...userData,
        createdAt: now,
        updatedAt: now,
        };

        const docRef = await db.collection(COLLECTION_NAME).add(newUserData);
        return {
            id: docRef.id,
            ...newUserData,
          };
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

export const getAllUsers = async (): Promise<User[]> => {
    try {
      const usersSnapshot = await db.collection(COLLECTION_NAME).get();
      
      return usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
};