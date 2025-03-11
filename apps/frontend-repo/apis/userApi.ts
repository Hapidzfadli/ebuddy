import axiosInstance from './axiosInstance';
import { User } from '@ebuddy/shared';

export const fetchUserData = async (userId?: string) => {
  try {
    const endpoint = userId ? `/fetch-user-data/${userId}` : '/fetch-user-data';
    const response = await axiosInstance.get(endpoint);
    return response.data.user;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export const updateUserData = async (userId: string, userData: Partial<User>) => {
  try {
    const response = await axiosInstance.put(`/update-user-data/${userId}`, userData);
    return response.data.user;
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
};

export const updateUserActivity = async () => {
  try {
    await axiosInstance.post('/update-activity');
    console.log('User activity timestamp updated');
  } catch (error) {
    console.error('Error updating user activity:', error);
  }
};

export const fetchAllUsers = async (
  limit = 10,
  lastDocId?: string,
  sortBy: 'potential' | 'ratings' | 'rents' | 'activity' = 'potential'
) => {
  try {
    const endpoint = '/fetch-all-users';
    const params = new URLSearchParams();
    
    params.append('limit', limit.toString());
    params.append('sortBy', sortBy);
    if (lastDocId) {
      params.append('lastDocId', lastDocId);
    }
    
    const response = await axiosInstance.get(`${endpoint}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};