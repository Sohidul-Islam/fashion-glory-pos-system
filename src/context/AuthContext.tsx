import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import AXIOS from "../api/network/Axios";
import { LOGIN_URL, PROFILE_URL } from "../api/api";
import { getCookiesAsObject } from "@/utils/cookies";

interface User {
  email: string;
  accountType?: "super admin" | "shop";
  id?: number;
  businessName?: string;
  child: {
    email: string;
    id?: number;
  } | null;
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  isLoading: boolean;
  isLoadingProfile: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const navigate = useNavigate();

  // Get profile query
  const {
    data: profileData,
    isLoading,
    isSuccess,
    error,
  } = useQuery({
    queryKey: [
      PROFILE_URL,
      { email: user?.child ? user?.child?.email : user?.email },
    ],
    queryFn: async () => {
      const { access_token } = getCookiesAsObject();
      if (!access_token || !user?.email) {
        navigate("/login");
        setUser(null);
        localStorage.removeItem("user");
        return null;
      }

      const response = await AXIOS.get(PROFILE_URL, {
        params: {
          email: user?.child ? user?.child?.email : user?.email,
        },
      });

      if (!response.status) {
        navigate("/login");
      }
      return response.data;
    },
    enabled: !!(user?.child ? user?.child?.email : user?.email),
  });

  useEffect(() => {
    if (error) {
      setUser(null);
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [error]);

  // Update user when profile data changes
  useEffect(() => {
    console.log({ profileData, isSuccess });
    if (isSuccess) {
      if (profileData) {
        setUser(profileData);
        localStorage.setItem("user", JSON.stringify(profileData));
      }
    }

    setIsInitializing(false);
  }, [profileData, isSuccess]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await AXIOS.post(LOGIN_URL, credentials);
      return response;
    },
    onSuccess: (response: any) => {
      if (response.status) {
        const { user, token } = response.data;
        console.log("login", { user });
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        document.cookie = `access_token=${token}; path=/`;
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error(response.message || "Login failed");
      }
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      toast.error(error?.message || "Login failed");
    },
  });

  const login = (email: string, password: string) => {
    loginMutation.mutate({ email, password });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    document.cookie =
      "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    navigate("/login");
  };

  // Check local storage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsInitializing(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoadingProfile: isLoading,
        isLoading: loginMutation.isPending || isInitializing,
      }}
    >
      {!isInitializing && children}
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
