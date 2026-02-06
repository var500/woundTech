import { VisitList } from "../VisitList";

export const Patient = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">My Health History</h2>
      </div>
      <div className="max-w-3xl mx-auto">
        <VisitList />
      </div>
    </div>
  );
};
