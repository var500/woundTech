import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth, visitsService, type Visit } from "~/utils/api";
import type { PaginationMetadata } from "~/utils/visitsService";
import type { DateFilterOption } from "~/components/VisitDateFilter";
import { filterVisitsByDateRange } from "~/components/VisitDateFilter";
import { getErrorMessage } from "~/utils/helper";

export const useFetchVisits = (itemsPerPage: number = 10) => {
  const { user: authUser } = useAuth();

  const [visits, setVisits] = useState<Visit[]>([]);
  const [dateFilter, setDateFilter] = useState<DateFilterOption>("all");
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

  const filteredVisits = filterVisitsByDateRange(visits, dateFilter);

  // Calculate effective pagination based on filtered results
  const effectivePagination: PaginationMetadata = useMemo(() => {
    if (dateFilter === "all") {
      // Use API pagination when no filter is applied
      return pagination;
    }

    // When filter is applied, calculate pagination based on filtered results
    const totalFiltered = filteredVisits.length;
    const totalPages = Math.ceil(totalFiltered / itemsPerPage);
    const currentPage = 1; // Reset to page 1 when filtering

    return {
      total: totalFiltered,
      page: currentPage,
      limit: itemsPerPage,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };
  }, [filteredVisits.length, dateFilter, pagination, itemsPerPage]);

  const goToNextPage = useCallback(() => {
    if (effectivePagination.hasNextPage) {
      goToPage(effectivePagination.page + 1);
    }
  }, [effectivePagination, goToPage]);

  const goToPreviousPage = useCallback(() => {
    if (effectivePagination.hasPreviousPage) {
      goToPage(effectivePagination.page - 1);
    }
  }, [effectivePagination, goToPage]);

  return {
    visits: filteredVisits,
    allVisits: visits,
    pagination: effectivePagination,
    loadingVisits,
    error,
    dateFilter,
    setDateFilter,
    refetch: fetchVisits,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  };
};
