import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { account, client } from '@/lib/appwrite';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextProps {
  isAuthenticated: boolean | null;
  loading: boolean;
  refreshAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: null,
  loading: true,
  refreshAuth: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const refreshAuth = async () => {
    try {
      // Attempt to get the stored JWT token
      const jwtToken = await AsyncStorage.getItem('jwtToken');
      console.log('JWT found:', !!jwtToken);

      if (!jwtToken) {
        console.log('No JWT token found, setting unauthenticated');
        setIsAuthenticated(false);
        return;
      }

      // Set the JWT on the client for authenticated requests
      client.setJWT(jwtToken);

      // Add timeout to ensure this call doesn't hang forever
      const userPromise = Promise.race([
        account.get(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Auth check timeout')), 5000)
        ),
      ]);

      const user = await userPromise;
      console.log('User auth succeeded:', user.$id);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth();

    // Fallback timeout - force auth state resolution after 10 seconds
    const timeout = setTimeout(() => {
      if (loading) {
        console.log('Auth check taking too long, forcing completion');
        setIsAuthenticated(false);
        setLoading(false);
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
