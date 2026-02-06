import { DashboardLayout } from "~/layout/DashboardLayout";
import type { Route } from "./+types/patient";
import { Patient } from "~/components/patient";
import { useAuth } from "~/utils/useAuth";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Patient - Wound Tech" },
    { name: "description", content: "Patient dashboard" },
  ];
}

export default function PatientRoute() {
  const { error, isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user?.role?.includes("patient"))) {
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

      <Patient />
    </DashboardLayout>
  );
}
