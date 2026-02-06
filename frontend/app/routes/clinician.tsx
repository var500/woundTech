import { DashboardLayout } from "~/layout/DashboardLayout";
import type { Route } from "./+types/clinician";
import { Clinician } from "~/components/clinician";
import { useAuth } from "~/utils/useAuth";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Clinician - Wound Tech" },
    { name: "description", content: "Clinician dashboard" },
  ];
}

export default function ClinicianRoute() {
  const { error, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    // Only redirect if loading is finished AND user is not auth
    if (!isLoading && !isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) return <div>Loading Profile...</div>;

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
