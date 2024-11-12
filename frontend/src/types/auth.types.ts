export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';  // au lieu de isAdmin: boolean
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
