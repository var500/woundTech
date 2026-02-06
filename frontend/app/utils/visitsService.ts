import axiosInstance from "./apiClient";

export interface Visit {
  id: string;
  userId: string;
  scheduled_at: string;
  check_in_at?: string;
  check_out_at?: string;
  clinician_id: string;
  patient_id: string;
  notes?: string;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
}

export interface ScheduleVisitRequest {
  patient_id: string;
  clinician_id: string;
  scheduled_at: string;
  notes?: string;
}

class VisitsService {
  /**
   * Get visits for a specific user
   */
  async getVisits(userId: string): Promise<Visit[]> {
    const response = await axiosInstance.get<Visit[]>(
      `/visits?userId=${userId}`,
      {},
    );
    return response.data;
  }

  /**
   * Schedule a new visit
   */
  async scheduleVisit(data: ScheduleVisitRequest): Promise<Visit> {
    const response = await axiosInstance.post<Visit>("/visits", data);
    return response.data;
  }

  /**
   * Check in for a visit
   */
  async checkIn(visitId: string): Promise<Visit> {
    const response = await axiosInstance.post<Visit>("/visits/check-in", {
      visit_id: visitId,
    });
    return response.data;
  }

  /**
   * Check out from a visit
   */
  async checkOut(visitId: string): Promise<Visit> {
    const response = await axiosInstance.post<Visit>("/visits/check-out", {
      visit_id: visitId,
    });
    return response.data;
  }

  /**
   * Get current user's visits
   */
  async getCurrentUserVisits(): Promise<Visit[]> {
    const user = this.getCurrentUser();
    if (!user?.id) throw new Error("No authenticated user found");
    return this.getVisits(user.id);
  }

  /**
   * Get current authenticated user
   */
  private getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
}

export default new VisitsService();
