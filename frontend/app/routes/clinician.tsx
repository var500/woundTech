import { DashboardLayout } from "~/layout/DashboardLayout";
import type { Route } from "./+types/clinician";
import { Clinician } from "~/components/clinician";
import { useAuth } from "~/utils/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Clinician - Wound Tech" },
    { name: "description", content: "Clinician dashboard" },
  ];
}

export default function ClinicianRoute() {
  const { error } = useAuth();
  return (
    <DashboardLayout>
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <Clinician />
    </DashboardLayout>
  );
}
