import { useState, useEffect, useCallback } from "react";
import authService, {
  type LoginRequest,
  type RegisterRequest,
  type User,
} from "./authService";

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  clinicianLogin: (credentials: LoginRequest) => Promise<void>;
  clinicianRegister: (data: RegisterRequest) => Promise<void>;
  patientLogin: (credentials: LoginRequest) => Promise<void>;
  patientRegister: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

/**
 * Custom hook for authentication management
 * Usage:
 * const { user, isAuthenticated, clinicianLogin, logout } = useAuth();
 */
export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = authService.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const clinicianLogin = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await authService.clinicianLogin(credentials);
      setUser(user);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clinicianRegister = useCallback(async (data: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await authService.clinicianRegister(data);
      setUser(user);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Registration failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const patientLogin = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await authService.patientLogin(credentials);
      setUser(user);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const patientRegister = useCallback(async (data: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await authService.patientRegister(data);
      setUser(user);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Registration failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setError(null);
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    clinicianLogin,
    clinicianRegister,
    patientLogin,
    patientRegister,
    logout,
  };
};
