import React, { createContext, useContext, useState, useEffect } from "react";
import { TokenResponse } from "../../../Common/interfaces/models";


interface AuthContextProps {
  isAuthenticated: boolean;
  login: (token: TokenResponse) => void;
  logout: () => void;
  UserData: TokenResponse | undefined;
}

export const AuthContext = createContext({} as AuthContextProps);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

// Componente proveedor del contexto
export const AuthProvider = ({ children }: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [UserData, setUserData] = useState<TokenResponse | undefined>();

  // Almacenar y verificar el token en el estado local
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        setUserData(JSON.parse(storedToken));
        setIsAuthenticated(true);
      } catch (error) {
        logout()
        console.error("Error al analizar el token almacenado:", error);
      }
    }
  }, []);

  const login = (newToken: TokenResponse) => {
    localStorage.setItem("token", JSON.stringify(newToken));
    setUserData(newToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUserData(undefined);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, UserData }}>
      {children}
    </AuthContext.Provider>
  );
};
