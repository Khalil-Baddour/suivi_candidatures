import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

// Décode le payload JWT (pas besoin de librairie)
function parseToken(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return sessionStorage.getItem("token") || null;
  });

  // Extrait le username directement du token
  const user = token ? parseToken(token) : null;

  const login = (newToken) => {
    sessionStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{
      token,
      login,
      logout,
      user,                  //  { username, user_id, ... }
      isAuthenticated: !!token
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);