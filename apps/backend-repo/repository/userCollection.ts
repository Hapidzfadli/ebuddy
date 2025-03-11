import { db } from '../config/firebaseConfig';
import { User } from '@ebuddy/shared';
import { Query, DocumentData } from 'firebase-admin/firestore';

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

export const updateUser = async(userId: string, userData: Partial<User>): Promise<User> => {
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

export const createUser = async (userData: User): Promise<User> => {
    try {
        const now = Date.now();

        const newUserData = {
          ...userData,
          createdAt: now,
          updatedAt: now,
          recentlyActive: now
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

export const getAllUsers = async (
    limit: number = 10, 
    startAfterDoc?: any,
    sortBy: 'potential' | 'ratings' | 'rents' | 'activity' = 'potential'
): Promise<{users: User[], lastDoc: any}> => {
    try {
        if (sortBy === 'potential') {
            const snapshot = await db.collection(COLLECTION_NAME).get();
            
            let usersWithScores = snapshot.docs.map(doc => {
                const data = doc.data();
                const user = { id: doc.id, ...data } as User;
                
                const MAX_RENTS = 100;
                const NOW = Date.now();
                const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
                
                const rating = user.totalAverageWeightRatings || 0;
                const rents = user.numberOfRents || 0;
                
                let activityTimestamp: number;
                if (typeof user.recentlyActive === 'number') {
                    activityTimestamp = user.recentlyActive;
                } else if (user.recentlyActive && typeof user.recentlyActive === 'object') {
                    const seconds = user.recentlyActive._seconds || 0;
                    activityTimestamp = seconds * 1000;
                } else {
                    activityTimestamp = 0;
                }
                
                const normalizedRents = Math.min(rents / MAX_RENTS * 5, 5);
                
                const activityAge = NOW - activityTimestamp;
                const normalizedActivity = Math.max(5 - (activityAge / ONE_WEEK_MS), 0);
                
                const potentialScore = 
                    (0.6 * rating) + 
                    (0.3 * normalizedRents) + 
                    (0.1 * normalizedActivity);
                
                return {
                    user,
                    potentialScore
                };
            });
            
            usersWithScores.sort((a, b) => b.potentialScore - a.potentialScore);
            
            if (startAfterDoc) {
                const startIndex = usersWithScores.findIndex(item => item.user.id === startAfterDoc.id);
                if (startIndex !== -1) {
                    usersWithScores = usersWithScores.slice(startIndex + 1);
                }
            }
            
            const limitedResults = usersWithScores.slice(0, limit);
            
            return {
                users: limitedResults.map(item => ({
                    ...item.user,
                    potentialScore: item.potentialScore
                })),
                lastDoc: limitedResults.length > 0 ? { id: limitedResults[limitedResults.length - 1].user.id } : null
            };
        } else {
            const fieldMapping = {
                'ratings': 'totalAverageWeightRatings',
                'rents': 'numberOfRents',
                'activity': 'recentlyActive'
            };
            
            // Use proper typing for Firestore query
            let firestoreQuery: Query<DocumentData> = db.collection(COLLECTION_NAME);
            
            // Apply sorting
            firestoreQuery = firestoreQuery.orderBy(fieldMapping[sortBy], 'desc').limit(limit);
            
            // Apply pagination if needed
            if (startAfterDoc) {
                firestoreQuery = firestoreQuery.startAfter(startAfterDoc);
            }
            
            const snapshot = await firestoreQuery.get();
            const lastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;
            
            return {
                users: snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as User[],
                lastDoc
            };
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

export const updateUserActivity = async (userId: string): Promise<void> => {
    try {
        await db.collection(COLLECTION_NAME).doc(userId).update({
            recentlyActive: Date.now()
        });
    } catch (error) {
        console.error('Error updating user activity:', error);
        throw error;
    }
}