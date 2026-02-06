import {
  Activity,
  FileText,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card } from "../card";
import { Button } from "../button";
import { getErrorMessage } from "~/utils/helper";
import { visitsService, type Visit } from "~/utils/api";
import type { PaginationMetadata } from "~/utils/visitsService";
import { useMemo, useState } from "react";
import { VisitStatus } from "~/common/enum";

export const VisitList = ({
  visits,
  loading,
  onRefresh,
  viewType = "clinician",
  pagination,
  onPageChange,
}: {
  visits: Visit[];
  loading: boolean;
  onRefresh: () => void;
  viewType?: "clinician" | "patient";
  pagination?: PaginationMetadata;
  onPageChange?: (page: number) => void;
}) => {
  const [error, setError] = useState<string | null>(null);

  const displayVisits = useMemo(() => {
    return [...visits].sort(
      (a, b) =>
        new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime(),
    );
  }, [visits]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
        <Activity className="w-10 h-10 text-teal-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">
          Fetching your appointments...
        </p>
      </div>
    );
  }

  if (visits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
        <FileText className="w-12 h-12 text-gray-300 mb-4" />
        <p className="text-gray-500 font-medium">No visits scheduled yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm flex items-center gap-2">
          <span className="font-bold">Error:</span> {error}
        </div>
      )}

      {displayVisits.map((visit) => {
        const person =
          viewType === "clinician" ? visit.patient : visit.clinician;
        const scheduledDate = new Date(visit.scheduled_at);

        return (
          <Card
            key={visit.id}
            className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white ring-1 ring-gray-100"
          >
            <div className="flex flex-col md:flex-row">
              {/* Left Column: Date & Time */}
              <div className="bg-slate-50 p-5 md:w-48 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-gray-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                  {scheduledDate.toLocaleDateString("en-US", {
                    month: "short",
                  })}
                </span>
                <span className="text-3xl font-black text-slate-800 leading-none">
                  {scheduledDate.getDate()}
                </span>
                <div className="flex items-center gap-1 mt-2 text-teal-600 font-semibold text-sm">
                  <Clock className="w-3.5 h-3.5" />
                  {scheduledDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              <div className="p-6 lg:p-8 grow flex flex-col justify-center">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    {/* Fixed Avatar - ensured no overlap */}
                    <div className="shrink-0 h-14 w-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center text-lg font-black shadow-sm">
                      {person?.fname?.[0]}
                      {person?.lname?.[0]}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-slate-900 text-xl lg:text-2xl tracking-tight truncate">
                        {person?.fname} {person?.lname}
                      </h4>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {viewType === "clinician" ? "Patient" : "Clinician"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Grid - ensures spacing on mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-sm font-semibold truncate">
                      {person?.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-sm font-semibold">
                      {person?.mobile || "No Mobile"}
                    </span>
                  </div>
                </div>
              </div>
              {/* Right Column: Actions */}
              <div className=" p-5 sm:p-10 flex-col justify-center gap-4 bg-white flex items-center  border-t md:border-t-0">
                <StatusBadge status={visit.status} />
                {viewType === "clinician" ? (
                  <div className="flex gap-2 w-full md:w-auto">
                    {visit.status === VisitStatus.SCHEDULED && (
                      <Button
                        onClick={() =>
                          handleAction(
                            visit.id,
                            visitsService.checkIn,
                            onRefresh,
                            setError,
                          )
                        }
                        className="flex-1 md:flex-none bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-6"
                      >
                        Check In
                      </Button>
                    )}
                    {visit.check_in_at && !visit.check_out_at && (
                      <Button
                        onClick={() =>
                          handleAction(
                            visit.id,
                            visitsService.checkOut,
                            onRefresh,
                            setError,
                          )
                        }
                        className="flex-1 md:flex-none bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-6"
                      >
                        Check Out
                      </Button>
                    )}
                  </div>
                ) : null}
              </div>
            </div>

            {/* Footer: Detailed Timestamps */}
            {visit.check_in_at && (
              <div className="px-5 py-2 bg-gray-50/50 border-t border-gray-100 flex gap-4 text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                <span>
                  In: {new Date(visit.check_in_at).toLocaleTimeString()}
                </span>
                {visit.check_out_at && (
                  <span>
                    Out: {new Date(visit.check_out_at).toLocaleTimeString()}
                  </span>
                )}
              </div>
            )}
          </Card>
        );
      })}

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between gap-4 mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="text-sm text-gray-600 font-medium">
            Page {pagination.page} of {pagination.totalPages} (
            {pagination.total} total)
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={!pagination.hasPreviousPage}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                pagination.hasPreviousPage
                  ? "bg-teal-600 text-teal-600 border border-teal-200 hover:bg-teal-50"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                pagination.hasNextPage
                  ? "bg-teal-600 text-white hover:bg-teal-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    [VisitStatus.SCHEDULED]: "bg-blue-50 text-blue-700 border-blue-100",
    [VisitStatus.COMPLETED]: "bg-green-50 text-green-700 border-green-100",
    default: "bg-gray-50 text-gray-600 border-gray-100",
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status] || styles.default}`}
    >
      {status}
    </span>
  );
};

const handleAction = async (
  id: string,
  action: (id: string) => Promise<any>,
  refresh: () => void,
  setErr: (s: string) => void,
) => {
  try {
    await action(id);
    refresh();
  } catch (err) {
    setErr(getErrorMessage(err));
  }
};
