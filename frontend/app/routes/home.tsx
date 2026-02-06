import { LoginView } from "~/LoginView";
import type { Route } from "./+types/home";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "~/utils/useAuth";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Wound Tech" },
    { name: "description", content: "Welcome to Wound Tech" },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && authUser?.role) {
      const target = authUser.role === "clinician" ? "/clinician" : "/patient";
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, authUser, navigate, isLoading]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return <LoginView />;
}
