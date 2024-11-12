export interface User {
    _id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt?: Date;
    role: 'user' | 'admin';
  }
  