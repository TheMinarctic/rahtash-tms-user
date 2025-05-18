import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refreshToken")
  );
  const navigate = useNavigate();

  const isAuthenticated = !!accessToken;

  const refreshAccessToken = async () => {
    try {
      const response = await fetch("https://api.rahtash-tms.ir/en/api/v1/user/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      const data = await response.json();

      if (data.success) {
        setAccessToken(data.data.access);
        localStorage.setItem("accessToken", data.data.access);
        return data.data.access;
      }
      return null;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
    }
  };

  useEffect(() => {
    if (refreshToken) {
      const interval = setInterval(() => {
        refreshAccessToken();
      }, 4 * 60 * 1000); // Refresh every 4 minutes
      return () => clearInterval(interval);
    }
  }, [refreshToken]);

  const login = async (email: string, password: string) => {
    try {
      debugger;
      const response = await fetch("https://api.rahtash-tms.ir/en/api/v1/user/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (data.access) {
        setAccessToken(data.access);
        setRefreshToken(data.refresh);
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
        toast.success("Successfully logged in!");
        // navigate("/shipments");
        window.location.href = "/shipments";
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error("An error occurred during login");
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      debugger;
      const response = await fetch("https://api.rahtash-tms.ir/en/api/v1/user/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
        }),
      });
      const data = await response.json();

      if (data.status) {
        toast.success("Account created successfully!");
        await login(email, password);
      } else {
        toast.error("Failed to create account");
        if (data.error.email) {
          toast.error(data.error.email[0]);
        }
      }
    } catch (error) {
      toast.error("An error occurred during signup");
    }
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // navigate("/login");
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, signup, logout, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
