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

export const updateUserActivity = async (userId: string) => {
  try {
    await axiosInstance.put(`/update-user-data/${userId}`, {});
    console.log('User activity timestamp updated');
  } catch (error) {
    console.error('Error updating user activity:', error);
  }
};