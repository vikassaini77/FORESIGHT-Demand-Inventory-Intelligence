import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();
const API_URL = 'http://localhost:8000/api/auth';

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setUser(res.data);
      })
      .catch(err => {
        console.error("Token invalid or expired", err);
        logout();
      })
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    const { access_token } = res.data;
    localStorage.setItem('token', access_token);
    setToken(access_token);
    return access_token;
  };

  const signup = async (name, email, password, company = "", jobTitle = "") => {
    await axios.post(`${API_URL}/signup`, { name, email, password, company, job_title: jobTitle });
    return await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, token, login, signup, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
