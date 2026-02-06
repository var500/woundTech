import { Activity, LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "~/components/button";
import { Navbar } from "~/components/Navbar/navbar";
import { useAuth } from "~/utils/useAuth";

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { user: authUser } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900">
      {/* Navbar */}
      <Navbar />
      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
