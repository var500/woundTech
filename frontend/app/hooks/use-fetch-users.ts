import { useCallback, useEffect, useState } from "react";
import { clinicianService, patientService, useAuth } from "~/utils/api";
import { getErrorMessage } from "~/utils/helper";

export const useFetchAllUsers = () => {
  const { user: authUser } = useAuth();

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clinicians, setClinicians] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);

  const fetchAllUsers = useCallback(async () => {
    if (!authUser?.id) {
      setLoadingUsers(false);
      return;
    }
    try {
      setLoadingUsers(true);
      setError(null);
      const cliniciansData = await clinicianService.getList();
      const patientsData = await patientService.getList();
      setClinicians(cliniciansData);
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
    clinicians,
    patients,
    loadingUsers,
    error,
    refetch: fetchAllUsers,
  };
};
