import React, { createContext, useState } from 'react';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isCustAuthenticated, setIsCustAuthenticated] = useState(false);

  const loginU = () => {
    setIsUserAuthenticated(true);
  };

  const logoutU = () => {
    setIsUserAuthenticated(false);
  };
  const loginC = () => {
    setIsCustAuthenticated(true);
  };

  const logoutC = () => {
    setIsCustAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isUserAuthenticated, isCustAuthenticated, loginU, logoutU, loginC, logoutC }}>
      {children}
    </AuthContext.Provider>
  );
};