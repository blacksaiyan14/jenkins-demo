// AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(); 

  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('access');

useEffect(() => {
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

  }
, [storedUser]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
