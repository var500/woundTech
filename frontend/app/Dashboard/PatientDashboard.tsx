export const PatientDashboard = ({ currentUser, visits, users }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-800">My Health History</h2>
    <div className="max-w-3xl mx-auto">
      <VisitList
        visits={visits}
        users={users}
        currentUser={currentUser}
        role="patient"
      />
    </div>
  </div>
);
