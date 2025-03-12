/* eslint-disable no-unused-vars */
import { createContext, useEffect, useState, ReactNode } from "react";
import { login as loginApi, register as registerApi } from "../api/auth";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: string | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }

    if (user) {
      localStorage.setItem("user", user);
    } else {
      localStorage.removeItem("user");
    }
  }, [token, user]);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginApi(email, password);
      setToken(response.token);
      setUser(email);
      navigate("/dashboard");
    } catch {
      throw new Error("Invalid credentials");
    }
  };

  const register = async (email: string, password: string) => {
    try {
      await registerApi(email, password);
      await login(email, password);
    } catch {
      throw new Error("Registration failed");
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
