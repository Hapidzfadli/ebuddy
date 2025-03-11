export interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds: number;
}
export interface User {
  id?: string;
  name?: string;
  email?: string;
  totalAverageWeightRatings?: number;
  numberOfRents?: number;
  recentlyActive?: FirestoreTimestamp | number;
  createdAt?: FirestoreTimestamp | number;
  updatedAt?: FirestoreTimestamp | number;
}
  
  export default User;