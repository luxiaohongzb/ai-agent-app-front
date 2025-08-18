import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  username: string;
  email?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User, token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      
      login: async (username: string, password: string) => {
        try {
          // 模拟登录API调用
          // 在实际项目中，这里应该调用真实的登录API
          if (username === 'admin' && password === 'admin123') {
            const user: User = {
              id: '1',
              username: 'admin',
              email: 'admin@example.com'
            };
            const token = 'mock-jwt-token-' + Date.now();
            
            set({
              isAuthenticated: true,
              user,
              token
            });
            
            return true;
          } else {
            return false;
          }
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },
      
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null
        });
      },
      
      setUser: (user: User, token: string) => {
        set({
          isAuthenticated: true,
          user,
          token
        });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token
      })
    }
  )
);