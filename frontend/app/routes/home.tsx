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
  const { user: authUser, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && authUser?.role) {
      if (authUser.role === "clinician") {
        navigate("/clinician");
      } else if (authUser.role === "patient") {
        navigate("/patient");
      }
    }
  }, [isAuthenticated, authUser, navigate]);

  if (isAuthenticated) {
    return <div>Loading...</div>;
  }

  return <LoginView />;
}
