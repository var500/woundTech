import axiosInstance from "./apiClient";

export interface Patient {
  id: string;
  email: string;
  fname: string;
  lname: string;
  dob?: string;
  city?: string;
  address?: string;
  mobile?: string;
  gender?: string;
  role: "patient";
}

class PatientService {
  /**
   * Get list of all patients
   */
  async getList(): Promise<Patient[]> {
    const response = await axiosInstance.get<Patient[]>("/patient/");
    return response.data;
  }

  /**
   * Get patient details by email or id
   */
  async getDetail(params: {
    email?: string;
    id?: string;
  }): Promise<Partial<Patient>> {
    const response = await axiosInstance.get<Partial<Patient>>(
      "/patient/detail",
      { params },
    );
    return response.data;
  }

  /**
   * Get current patient details (self)
   */
  async getCurrentPatientDetails(): Promise<Partial<Patient>> {
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

export default new PatientService();
