// User model
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string; // stored Cloudinary link
  createdAt: number;
}