import React, { createContext, useState } from 'react';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isCustAuthenticated, setIsCustAuthenticated] = useState(false);
  const [idU, setIdU] = useState(0);
  const [idC, setIdC] = useState(0);

  const loginU = () => {
    setIsUserAuthenticated(true);
  };

  const logoutU = () => {
    setIsUserAuthenticated(false);
    setIdU(0);
  };
  const loginC = () => {
    setIsCustAuthenticated(true);
  };

  const logoutC = () => {
    setIsCustAuthenticated(false);
    setIdC(0)
  };

  return (
    <AuthContext.Provider value={{ isUserAuthenticated, isCustAuthenticated, loginU, logoutU, loginC, logoutC, idU, idC, setIdU, setIdC }}>
      {children}
    </AuthContext.Provider>
  );
};