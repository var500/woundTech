import { useEffect, useState } from "react";
import { SEED_USERS, SEED_VISITS } from "~/utils/mock";
import { PatientVisitTracker } from "~/appContent";

export function Welcome() {
  const [users, setUsers] = useState([]);
  const [visits, setVisits] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const storedUsers = localStorage.getItem("pvt_users");
    const storedVisits = localStorage.getItem("pvt_visits");
    const storedSession = sessionStorage.getItem("pvt_session");

    if (storedUsers) setUsers(JSON.parse(storedUsers));
    else {
      setUsers(SEED_USERS);
      localStorage.setItem("pvt_users", JSON.stringify(SEED_USERS));
    }

    if (storedVisits) setVisits(JSON.parse(storedVisits));
    else {
      setVisits(SEED_VISITS);
      localStorage.setItem("pvt_visits", JSON.stringify(SEED_VISITS));
    }

    if (storedSession) {
      const session = JSON.parse(storedSession);
      setCurrentUser(session.user);
    }
  }, []);

  const saveUsers = (newUsers) => {
    setUsers(newUsers);
    localStorage.setItem("pvt_users", JSON.stringify(newUsers));
  };

  const saveVisits = (newVisits) => {
    setVisits(newVisits);
    localStorage.setItem("pvt_visits", JSON.stringify(newVisits));
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900">
      <PatientVisitTracker />
    </div>
  );
}
