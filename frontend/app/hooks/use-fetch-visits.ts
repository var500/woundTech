import { useCallback, useEffect, useState } from "react";
import { useAuth, visitsService, type Visit } from "~/utils/api";
import type { PaginationMetadata } from "~/utils/visitsService";
import { getErrorMessage } from "~/utils/helper";

export const useFetchVisits = (itemsPerPage: number = 10) => {
  const { user: authUser } = useAuth();

  const [visits, setVisits] = useState<Visit[]>([]);
  const [pagination, setPagination] = useState<PaginationMetadata>({
    total: 0,
    page: 1,
    limit: itemsPerPage,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [loadingVisits, setLoadingVisits] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVisits = useCallback(
    async (page: number = 1) => {
      if (!authUser?.id) {
        setLoadingVisits(false);
        return;
      }

      try {
        setLoadingVisits(true);
        setError(null);

        const response = await visitsService.getCurrentUserVisits(
          page,
          itemsPerPage,
        );
        console.log("Fetched visits:", response);
        setVisits(response.data);
        setPagination(response.pagination);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoadingVisits(false);
      }
    },
    [authUser?.id, itemsPerPage],
  );

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  const goToPage = useCallback(
    (page: number) => {
      fetchVisits(page);
    },
    [fetchVisits],
  );

  const goToNextPage = useCallback(() => {
    if (pagination.hasNextPage) {
      goToPage(pagination.page + 1);
    }
  }, [pagination, goToPage]);

  const goToPreviousPage = useCallback(() => {
    if (pagination.hasPreviousPage) {
      goToPage(pagination.page - 1);
    }
  }, [pagination, goToPage]);

  return {
    visits,
    pagination,
    loadingVisits,
    error,
    refetch: fetchVisits,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  };
};
