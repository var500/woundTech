import { Activity, FileText } from "lucide-react";
import { Card } from "../card";
import { Button } from "../button";
import { getErrorMessage } from "~/utils/helper";
import { useFetchVisits } from "~/hooks/use-fetch-visits";
import { visitsService, type Visit } from "~/utils/api";
import { useMemo, useState } from "react";
import { VisitStatus } from "~/common/enum";

export const VisitList = ({
  visits,
  loading,
  onRefresh,
}: {
  visits: Visit[];
  loading: boolean;
  onRefresh: () => void;
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
      <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
        <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3 animate-spin" />
        <p className="text-gray-500 font-medium">Loading visits...</p>
      </div>
    );
  }

  if (visits.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No visit records found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {displayVisits.map((visit) => (
        <Card
          key={visit.id}
          className="hover:shadow-md transition-shadow duration-200"
        >
          <div className="p-5">
            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-teal-50 text-teal-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                    {new Date(visit.scheduled_at).toLocaleDateString()}
                  </span>
                  <h4 className="font-bold text-gray-900 text-lg">Visit</h4>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium text-gray-500">Status:</span>{" "}
                    <span className="capitalize">{visit.status}</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {visit.status === VisitStatus.SCHEDULED && (
                  <>
                    <Button
                      size="sm"
                      onClick={async () => {
                        try {
                          await visitsService.checkIn(visit.id);
                          await onRefresh();
                        } catch (err) {
                          setError(getErrorMessage(err));
                        }
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Check In
                    </Button>
                  </>
                )}
                {visit.check_in_at && !visit.check_out_at && (
                  <Button
                    size="sm"
                    onClick={async () => {
                      try {
                        await visitsService.checkOut(visit.id);
                        await onRefresh();
                      } catch (err) {
                        setError(getErrorMessage(err));
                      }
                    }}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Check Out
                  </Button>
                )}
              </div>
            </div>
            {visit.check_in_at && (
              <div className="text-xs text-gray-500 space-y-1 mb-3">
                <p>
                  <strong>Checked In:</strong>{" "}
                  {new Date(visit.check_in_at).toLocaleString()}
                </p>
                {visit.check_out_at && (
                  <p>
                    <strong>Checked Out:</strong>{" "}
                    {new Date(visit.check_out_at).toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};
