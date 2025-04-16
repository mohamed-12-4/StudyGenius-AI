'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, login, logout, createUser } from '@/lib/appwrite';

// Create Authentication Context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [initAttempted, setInitAttempted] = useState(false);

  // Check if user is logged in on initial load
  useEffect(() => {
    if (!initAttempted) {
      const checkUser = async () => {
        try {
          console.log('Checking for existing user session...');
          const currentUser = await getCurrentUser();
          console.log('User session check result:', currentUser ? 'Found user' : 'No user found');
          setUser(currentUser);
        } catch (error) {
          console.error('Error checking user session:', error);
          setUser(null);
        } finally {
          setLoading(false);
          setInitAttempted(true);
        }
      };

      checkUser();
    }
  }, [initAttempted]);

  // Login function
  const handleLogin = async (email, password) => {
    setLoading(true);
    try {
      console.log('Attempting login for:', email);
      // No need to call logout first as our updated appwrite.js handles this
      const session = await login(email, password);
      // After successful login, get the user details
      const currentUser = await getCurrentUser();
      console.log('Login successful, user:', currentUser ? currentUser.$id : 'unknown');
      setUser(currentUser);
      return { success: true, session };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to login. Please check your credentials.'
      };
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const handleSignup = async (email, password, name) => {
    setLoading(true);
    try {
      console.log('Attempting signup for:', email);
      // No need to call logout first as our updated appwrite.js handles this
      const result = await createUser(email, password, name);
      // After successful signup and auto-login, get the user details
      const currentUser = await getCurrentUser();
      console.log('Signup successful, user:', currentUser ? currentUser.$id : 'unknown');
      setUser(currentUser);
      return { success: true, result };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to create account. Please try again.'
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const handleLogout = async () => {
    setLoading(true);
    try {
      console.log('Logging out...');
      await logout();
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, we should still clear user state and redirect
      setUser(null);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    loading,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}