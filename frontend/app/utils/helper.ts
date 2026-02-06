export const generateId = () => Math.random().toString(36).substr(2, 9);

/**
 * API Error handling utilities
 */

export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

/**
 * Extract error message from API response
 */
export const getErrorMessage = (error: any): string => {
  if (!error) return "An unexpected error occurred";

  if (typeof error === "string") return error;

  // Axios error
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Generic error message
  if (error.message) {
    return error.message;
  }

  return "An unexpected error occurred";
};

/**
 * Format API error for display
 */
export const formatApiError = (error: any): ApiError => {
  return {
    message: getErrorMessage(error),
    status: error.response?.status,
    details: error.response?.data,
  };
};

/**
 * Check if user has specific role
 */
export const hasRole = (
  userRole: string | undefined,
  requiredRole: "clinician" | "patient",
): boolean => {
  return userRole === requiredRole;
};

/**
 * Format date for display
 */
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format datetime for display
 */
export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
