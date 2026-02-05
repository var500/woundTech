import { useState } from "react";
import { generateId } from "~/utils/helper";

export const ClinicianDashboard = ({
  currentUser,
  visits,
  setVisits,
  users,
}) => {
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");

  const patients = users.filter((u) => u.role === "patient");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newVisit = {
      id: generateId(),
      clinicianId: currentUser.id,
      patientId,
      date,
      diagnosis,
      notes,
      timestamp: Date.now(),
    };
    setVisits([...visits, newVisit]);
    setPatientId("");
    setDiagnosis("");
    setNotes("");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Clinician Dashboard
        </h2>
        <Link to="/admin">
          <Button variant="secondary">
            <Users className="w-4 h-4" /> Manage Records
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-teal-600" /> Record New Visit
            </h3>
            <form onSubmit={handleSubmit}>
              <Select
                label="Select Patient"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                options={patients.map((p) => ({ value: p.id, label: p.name }))}
                required
              />
              <Input
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
              <Input
                label="Diagnosis"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                required
              />
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 h-24"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  required
                ></textarea>
              </div>
              <Button type="submit" className="w-full">
                Save Visit
              </Button>
            </form>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <VisitList
            visits={visits}
            users={users}
            currentUser={currentUser}
            role="clinician"
          />
        </div>
      </div>
    </div>
  );
};
