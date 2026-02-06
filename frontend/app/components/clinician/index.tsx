import { NewVisitForm } from "../Forms/newVisitForm";

import { Calendar, RefreshCcw } from "lucide-react";
import { useFetchAllUsers } from "~/hooks/use-fetch-users";
import { useFetchVisits } from "~/hooks/use-fetch-visits";
import { VisitList } from "../VisitList";
import { Button } from "../button";

export const Clinician = () => {
  const { loadingUsers, refetch: fetchAllUsers } = useFetchAllUsers();
  const {
    visits,
    pagination,
    loadingVisits,
    dateFilter,
    setDateFilter,
    refetch: fetchVisits,
    goToPage,
  } = useFetchVisits();
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Clinician Dashboard
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 ">
            {!loadingUsers ? (
              <Button className="w-full mb-4" onClick={fetchAllUsers}>
                Load Patients
              </Button>
            ) : (
              <Button className="w-full mb-4" disabled>
                Fetching Patient List
              </Button>
            )}
            <NewVisitForm onVisitCreated={fetchVisits} />
          </div>
        </div>

        {/* Right Col: List */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Your Visits
            </h3>
            <div className="flex items-center gap-2">
              {/* Spinner for the refresh icon */}
              <button
                onClick={() => fetchVisits(1)}
                disabled={loadingVisits}
                className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <RefreshCcw
                  className={`w-4 h-4 ${loadingVisits ? "animate-spin text-teal-600" : "text-gray-500"}`}
                />
              </button>

              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {pagination?.total || 0} records
              </span>
            </div>
          </div>
          <VisitList
            visits={visits}
            loading={loadingVisits}
            onRefresh={() => fetchVisits(1)}
            viewType="clinician"
            pagination={pagination}
            onPageChange={goToPage}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
          />
        </div>
      </div>
    </div>
  );
};
