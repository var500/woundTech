import { useCallback, useState } from "react";
import { useAuth, visitsService, type Visit } from "~/utils/api";
import { Select } from "../select";
import { Card } from "../card";
import { Calendar, Stethoscope } from "lucide-react";
import { Input } from "../input";
import { Button } from "../button";
import { getErrorMessage } from "~/utils/helper";
import { useFetchVisits } from "~/hooks/use-fetch-visits";
import { useFetchAllUsers } from "~/hooks/use-fetch-users";

export const NewVisitForm = () => {
  const { user: authUser } = useAuth();
  const [patientId, setPatientId] = useState("");
  const [scheduledDateTime, setScheduledDateTime] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const { loadingUsers } = useFetchAllUsers();

  const { refetch: fetchVisits } = useFetchVisits();
  const { patients } = useFetchAllUsers();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setFormError(null);

      const timestamp = new Date(scheduledDateTime).getTime().toString();

      await visitsService.scheduleVisit({
        clinician_id: authUser!.id,
        patient_id: patientId,
        scheduled_at: timestamp,
        notes,
      });

      await fetchVisits();
      // onSuccess();

      setPatientId("");
      setScheduledDateTime(new Date().toISOString().split("T")[0]);
      setNotes("");
    } catch (err) {
      setFormError(getErrorMessage(err) as any);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Stethoscope className="w-5 h-5 text-teal-600" />
        Schedule New Visit
      </h3>

      {formError && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4">
          <Select
            label="Select Patient"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            options={patients.map((p) => ({ value: p.id, label: p.email }))}
            required
            disabled={isSubmitting || loadingUsers}
          />
          <div className="relative">
            <Input
              placeholder="Date"
              label="Scheduled Date"
              type="datetime-local"
              value={scheduledDateTime}
              onChange={(e) => setScheduledDateTime(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full"
            />
            <Calendar className="absolute  right-3 top-9  w-4 h-4 pointer-events-none text-gray-500" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all h-24 resize-none"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Visit notes..."
            disabled={isSubmitting}
          ></textarea>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting || !patientId}>
            {isSubmitting ? "Scheduling..." : "Schedule Visit"}
          </Button>
        </div>
      </form>
    </Card>
  );
};
