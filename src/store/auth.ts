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
  isSubscriptionExpired: (user: User) => boolean;
  isSubscriptionExpiringSoon: (user: User) => boolean;
}

// Helper function to add days to a date
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Initial users with subscription dates
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
    subscriptionExpiresAt: addDays(new Date(), 25).toISOString(), // Expires in 25 days
    createdAt: new Date().toISOString()
  },
  { 
    email: 'house2@game.cu', 
    password: 'house123', 
    role: 'house', 
    name: 'House Manager 2',
    subscriptionPaid: false,
    subscriptionExpiresAt: addDays(new Date(), -1).toISOString(), // Expired yesterday
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
  { 
    email: 'player2@user.cu', 
    password: 'player123', 
    role: 'player', 
    name: 'Test Player2',
    balance: 1000,
    houseId: 'house2@game.cu',
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
          const newUser = { ...user };
    console.log("Usuario guardado en Zustand:", newUser);
    set({ user: newUser });
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
            subscriptionPaid: false,
            subscriptionExpiresAt: addDays(new Date(), 30).toISOString() // New houses get 30 days
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
          // Update current user if it's the one being modified
          user: state.user?.email === email 
            ? { ...state.user, ...updates }
            : state.user
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
      isSubscriptionExpired: (user) => {
        if (user.role !== 'house' || !user.subscriptionExpiresAt) return false;
        return new Date(user.subscriptionExpiresAt) < new Date();
      },
      isSubscriptionExpiringSoon: (user) => {
        if (user.role !== 'house' || !user.subscriptionExpiresAt) return false;
        const expirationDate = new Date(user.subscriptionExpiresAt);
        const warningDate = addDays(new Date(), 7); // Warning 7 days before expiration
        return expirationDate <= warningDate && expirationDate > new Date();
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);