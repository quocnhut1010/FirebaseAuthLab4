// providers/AuthenticatedUserProvider.js
import React, { useState, createContext } from 'react';

// Tạo Context object
export const AuthenticatedUserContext = createContext({});

export const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user sẽ là null ban đầu, hoặc object user từ Firebase khi đăng nhập

  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};