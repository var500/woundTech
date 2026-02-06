import { NewVisitForm } from "../Forms/newVisitForm";

import { Calendar } from "lucide-react";
import { useFetchAllUsers } from "~/hooks/use-fetch-users";
import { useFetchVisits } from "~/hooks/use-fetch-visits";
import { VisitList } from "../VisitList";
export const Clinician = () => {
  const { patients, loadingUsers, refetch: fetchAllUsers } = useFetchAllUsers();
  const { visits } = useFetchVisits();
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
          <div className="sticky top-24">
            {patients.length === 0 && !loadingUsers && (
              <button
                onClick={fetchAllUsers}
                className="mb-4 w-full px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
              >
                Load Patients
              </button>
            )}
            <NewVisitForm />
          </div>
        </div>

        {/* Right Col: List */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Your Visits
            </h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {visits.length} records
            </span>
          </div>
          <VisitList />
        </div>
      </div>
    </div>
  );
};
