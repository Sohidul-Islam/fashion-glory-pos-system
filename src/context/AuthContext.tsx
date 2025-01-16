/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import AXIOS from "../api/network/Axios";
import { LOGIN_URL } from "../api/api";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check local storage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const loginMutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      AXIOS.post(LOGIN_URL, credentials),
    onSuccess: (data: any) => {
      if (data.status) {
        toast.success(data.message);
        const { user, token } = data.data;
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        document.cookie = `access_token=${token}; path=/`;
        navigate("/dashboard");
      } else {
        toast.error(data.message);
      }
    },
  });

  const login = async (email: string, password: string) => {
    try {
      loginMutation.mutate({ email, password });
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    document.cookie =
      "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoading: loginMutation.isPending }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
