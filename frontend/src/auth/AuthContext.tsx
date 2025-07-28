import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  username: string;
  securityQuestion?: string;
  // Add more fields as needed
}

interface RegisterData {
  username: string;
  password: string;
  securityQuestion: string;
  securityAnswer: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    try {
      if (storedToken && storedUser && storedUser !== 'undefined') {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        // Set default axios header for authenticated requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
    } catch (error) {
      console.error('Error parsing stored auth data:', error);
      // Clear corrupted data
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      console.log('Making API call to /api/auth/login');
      const res = await axios.post('/api/auth/login', { username, password });
      console.log('API response:', res.data);
      
      // Validate response structure - adjust to match your actual API response
      if (!res.data.token || !res.data.username) {
        console.error('Invalid response structure:', res.data);
        throw new Error('Invalid login response - missing token or username');
      }

      // Create user object from the API response structure
      const newToken = res.data.token;
      const newUser: User = {
        username: res.data.username,
        securityQuestion: res.data.securityQuestion
      };
      
      console.log('Setting token and user:', { newToken, newUser });
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Set axios default header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      console.log('Login completed successfully');
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      // Clean up on error
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      throw error; // Re-throw to be handled by the login component
    }
  };

  const register = async (data: RegisterData) => {
    await axios.post('/api/auth/register', data);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}