import { useCallback, useEffect, useState } from "react";
import { clinicianService, patientService, useAuth } from "~/utils/api";
import { getErrorMessage } from "~/utils/helper";

export const useFetchAllUsers = () => {
  const { user: authUser } = useAuth();

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patients, setPatients] = useState<any[]>([]);

  const fetchAllUsers = useCallback(async () => {
    if (!authUser?.id) {
      setLoadingUsers(false);
      return;
    }
    try {
      setLoadingUsers(true);
      setError(null);
      const patientsData = await patientService.getList();

      setPatients(patientsData);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err) as any);
    } finally {
      setLoadingUsers(false);
    }
  }, [authUser?.id]);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  return {
    patients,
    loadingUsers,
    error,
    refetch: fetchAllUsers,
  };
};
