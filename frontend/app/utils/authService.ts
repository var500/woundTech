import axiosInstance from "./apiClient";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  id: string;
  fname: string;
  lname: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  fname: string;
  lname: string;
  role: "clinician" | "patient";
}

class AuthService {
  /**
   * Decode JWT payload to extract role and other info
   */
  private decodeJWT(token: string): any {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Failed to decode JWT:", error);
      return null;
    }
  }

  /**
   * Helper to create user object from response
   */
  private createUserFromResponse(response: AuthResponse): User {
    const decoded = this.decodeJWT(response.accessToken);
    return {
      id: response.id,
      email: response.email,
      fname: response.fname,
      lname: response.lname,
      role: decoded?.role || "patient",
    };
  }

  /**
   * Clinician login
   */
  async clinicianLogin(credentials: LoginRequest): Promise<User> {
    const response = await axiosInstance.post<AuthResponse>(
      "/clinician/login",
      credentials,
    );
    const user = this.createUserFromResponse(response.data);
    this.setToken(response.data.accessToken);
    this.setRefreshToken(response.data.refreshToken);
    this.setUser(user);
    return user;
  }

  /**
   * Clinician registration
   */
  async clinicianRegister(data: RegisterRequest): Promise<User> {
    const response = await axiosInstance.post<AuthResponse>("/clinician", data);
    const user = this.createUserFromResponse(response.data);
    this.setToken(response.data.accessToken);
    this.setRefreshToken(response.data.refreshToken);
    this.setUser(user);
    return user;
  }

  /**
   * Patient login
   */
  async patientLogin(credentials: LoginRequest): Promise<User> {
    const response = await axiosInstance.post<AuthResponse>(
      "/patient/login",
      credentials,
    );
    const user = this.createUserFromResponse(response.data);
    this.setToken(response.data.accessToken);
    this.setRefreshToken(response.data.refreshToken);
    this.setUser(user);
    return user;
  }

  /**
   * Patient registration
   */
  async patientRegister(data: RegisterRequest): Promise<User> {
    const response = await axiosInstance.post<AuthResponse>("/patient", data);
    const user = this.createUserFromResponse(response.data);
    this.setToken(response.data.accessToken);
    this.setRefreshToken(response.data.refreshToken);
    this.setUser(user);
    return user;
  }

  /**
   * Logout - clear token and user from storage
   */
  logout(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem("access_token");
  }

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem("refresh_token");
  }

  /**
   * Get stored user
   */
  getUser(): User | null {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Private helper to set token
   */
  private setToken(token: string): void {
    localStorage.setItem("access_token", token);
  }

  /**
   * Private helper to set refresh token
   */
  private setRefreshToken(token: string): void {
    localStorage.setItem("refresh_token", token);
  }

  /**
   * Private helper to set user
   */
  private setUser(user: User): void {
    localStorage.setItem("user", JSON.stringify(user));
  }
}

export default new AuthService();
