"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: 'user' | 'admin';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: SignupData) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (userData: Partial<User> & { currentPassword?: string; newPassword?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  console.log('AuthProvider: Component rendering, isLoading:', isLoading, 'user:', !!user, 'mounted:', mounted);

  // Handle client-side mounting
  useEffect(() => {
    console.log('AuthProvider: Mounting on client side');
    setMounted(true);
  }, []);

  // Initialize auth state after mounting
  useEffect(() => {
    if (!mounted) {
      console.log('AuthProvider: Not mounted yet, skipping auth init');
      return;
    }

    console.log('AuthProvider: Starting auth initialization');

    const initAuth = async () => {
      console.log('AuthContext: initAuth called');
      const token = localStorage.getItem('authToken');
      console.log('AuthContext: token exists:', !!token);

      if (token) {
        try {
          console.log('AuthContext: Making request to /api/auth/me');
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          console.log('AuthContext: Response status:', response.status);

          if (response.ok) {
            const data = await response.json();
            console.log('AuthContext: Successfully got user data:', !!data.user);
            setUser(data.user);
          } else {
            if (response.status === 401) {
              console.log('AuthContext: Token invalid, removing');
              localStorage.removeItem('authToken');
            } else {
              console.log('AuthContext: Non-401 error:', response.status);
            }
          }
        } catch (error) {
          console.error('AuthContext: Error verifying token:', error);
        }
      } else {
        console.log('AuthContext: No token found');
      }

      console.log('AuthContext: Setting isLoading to false');
      setIsLoading(false);
    };

    initAuth();
  }, [mounted]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('authToken', data.token);
        return { success: true };
      }
      const errorData = await response.json();
      console.error('Login error:', errorData.error);
      return { success: false, error: errorData.error || 'Invalid email or password' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signup = async (userData: SignupData): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('authToken', data.token);
        return { success: true };
      }
      const errorData = await response.json();
      console.error('Signup error:', errorData.error);
      return { success: false, error: errorData.error || 'Failed to create account' };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const updateProfile = async (userData: Partial<User> & { currentPassword?: string; newPassword?: string }): Promise<{ success: boolean; error?: string }> => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return { success: true };
      }
      const errorData = await response.json();
      console.error('Update profile error:', errorData.error);
      return { success: false, error: errorData.error || 'Failed to update profile' };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      isLoading,
      login,
      signup,
      updateProfile,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
