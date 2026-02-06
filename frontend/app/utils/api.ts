/**
 * API Services and Hooks Index
 *
 * Import all API services and hooks from here:
 *
 * Example:
 * import { authService, useAuth, clinicianService, visitsService } from '@/utils/api';
 */

export { default as authService } from "./authService";
export type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "./authService";

export { default as clinicianService } from "./clinicianService";
export type { Clinician } from "./clinicianService";

export { default as patientService } from "./patientService";
export type { Patient } from "./patientService";

export { default as visitsService } from "./visitsService";
export type {
  Visit,
  ScheduleVisitRequest,
  PaginationMetadata,
  PaginatedVisitsResponse,
} from "./visitsService";

export { useAuth } from "./useAuth";
export type { default as axiosInstance } from "./apiClient";
