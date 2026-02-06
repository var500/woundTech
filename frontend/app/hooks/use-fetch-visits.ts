import { useCallback, useEffect, useState } from "react";
import { useAuth, visitsService, type Visit } from "~/utils/api";
import { getErrorMessage } from "~/utils/helper";

export const useFetchVisits = () => {
  const { user: authUser } = useAuth();

  const [visits, setVisits] = useState<Visit[]>([]);
  const [loadingVisits, setLoadingVisits] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVisits = useCallback(async () => {
    if (!authUser?.id) {
      setLoadingVisits(false);
      return;
    }

    try {
      setLoadingVisits(true);
      setError(null);

      const data = await visitsService.getCurrentUserVisits();
      console.log("Fetched visits:", data);
      setVisits(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingVisits(false);
    }
  }, [authUser?.id]);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  return {
    visits,
    loadingVisits,
    error,
    refetch: fetchVisits,
  };
};
