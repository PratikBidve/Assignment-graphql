import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, ApolloError } from '@apollo/client';
import { ME } from '../graphql/queries';

interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: ApolloError | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const token = localStorage.getItem('token');
  console.log('Current token in AuthContext:', token);
  
  const { loading, error, data, refetch } = useQuery(ME, {
    skip: !token,
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      console.log('ME query completed:', data);
      if (data?.me) {
        setUser(data.me);
      }
    },
    onError: (error) => {
      console.error('ME query error:', error);
    }
  });

  useEffect(() => {
    console.log('Token changed, current token:', token);
    if (token) {
      console.log('Refetching ME query...');
      refetch();
    } else {
      console.log('No token, setting user to null');
      setUser(null);
    }
  }, [token, refetch]);

  const logout = () => {
    console.log('Logging out...');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error: error || null, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 