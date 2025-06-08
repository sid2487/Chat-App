import { createContext, useContext, useEffect, useState } from "react";

const Authcontext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("chat-user")));

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("chat-user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("chat-user");
  };

  return (
    <Authcontext.Provider value={{ user, login, logout }}> 
      {children}
    </Authcontext.Provider>
  );
};

export const useAuth = () => useContext(Authcontext);