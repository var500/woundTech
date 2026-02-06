import axiosInstance from "./apiClient";

export interface Clinician {
  id: string;
  email: string;
  fname: string;
  lname: string;
  dob?: string;
  city?: string;
  address?: string;
  mobile?: string;
  gender?: string;
  role: "clinician";
}

class ClinicianService {
  /**
   * Get list of all clinicians
   */
  async getList(): Promise<Clinician[]> {
    const response = await axiosInstance.get<Clinician[]>("/clinician/");
    return response.data;
  }

  /**
   * Get clinician details by email or id
   */
  async getDetail(params: {
    email?: string;
    id?: string;
  }): Promise<Partial<Clinician>> {
    const response = await axiosInstance.get<Partial<Clinician>>(
      "/clinician/detail",
      { params },
    );
    return response.data;
  }

  /**
   * Get current clinician details (self)
   */
  async getCurrentClinicianDetails(): Promise<Partial<Clinician>> {
    // This would use the authenticated user's ID
    // Assuming you have a utility to get the current user ID
    const user = this.getCurrentUser();
    if (!user?.id) throw new Error("No authenticated user found");
    return this.getDetail({ id: user.id });
  }

  /**
   * Get current authenticated user
   */
  private getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
}

export default new ClinicianService();
