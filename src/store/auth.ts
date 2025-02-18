import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addUser: (user: Omit<User, 'createdAt'>) => void;
  updateUser: (email: string, updates: Partial<User>) => void;
  getUsersByRole: (role: User['role']) => User[];
  getUsersByHouse: (houseId: string) => User[];
}

// Initial users
const initialUsers: User[] = [
  { 
    email: 'admin@admin.cu', 
    password: 'admin123', 
    role: 'admin', 
    name: 'Administrator',
    createdAt: new Date().toISOString()
  },
  { 
    email: 'house@game.cu', 
    password: 'house123', 
    role: 'house', 
    name: 'House Manager',
    subscriptionPaid: true,
    createdAt: new Date().toISOString()
  },
  { 
    email: 'player@user.cu', 
    password: 'player123', 
    role: 'player', 
    name: 'Test Player',
    balance: 1000,
    houseId: 'house@game.cu',
    createdAt: new Date().toISOString()
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: initialUsers,
      login: (email: string, password: string) => {
        const user = get().users.find(
          (u) => u.email === email && u.password === password
        );
        if (user) {
          set({ user });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null }),
      addUser: (userData) => {
        const currentUser = get().user;
        if (!currentUser) return;
        
        // Admins can add any type of user
        // Houses can only add players
        if (
          currentUser.role !== 'admin' && 
          (currentUser.role !== 'house' || userData.role !== 'player')
        ) {
          return;
        }

        const newUser: User = {
          ...userData,
          createdAt: new Date().toISOString(),
          ...(userData.role === 'player' && currentUser.role === 'house' ? {
            houseId: currentUser.email,
            balance: 0
          } : {}),
          ...(userData.role === 'house' ? {
            subscriptionPaid: false
          } : {})
        };
        
        set((state) => ({
          users: [...state.users, newUser],
        }));
      },
      updateUser: (email, updates) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.email === email ? { ...user, ...updates } : user
          ),
        }));
      },
      getUsersByRole: (role) => {
        return get().users.filter((user) => user.role === role);
      },
      getUsersByHouse: (houseId) => {
        return get().users.filter(
          (user) => user.role === 'player' && user.houseId === houseId
        );
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
