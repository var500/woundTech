import {
  Activity,
  Calendar,
  ChevronRight,
  FileText,
  LogOut,
  Menu,
  Stethoscope,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "~/components/button";
import { Card } from "~/components/card";
import { Input } from "~/components/input";
import { Select } from "~/components/select";
import { generateId } from "~/utils/helper";
import { SEED_USERS, SEED_VISITS } from "~/utils/mock";

export function PatientVisitTracker() {
  // State
  const [users, setUsers] = useState([]);
  const [visits, setVisits] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState("login"); // login, clinician, patient, admin
  const [token, setToken] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load data on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem("pvt_users");
    const storedVisits = localStorage.getItem("pvt_visits");
    const storedSession = sessionStorage.getItem("pvt_session");

    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers(SEED_USERS);
      localStorage.setItem("pvt_users", JSON.stringify(SEED_USERS));
    }

    if (storedVisits) {
      setVisits(JSON.parse(storedVisits));
    } else {
      setVisits(SEED_VISITS);
      localStorage.setItem("pvt_visits", JSON.stringify(SEED_VISITS));
    }

    if (storedSession) {
      const session = JSON.parse(storedSession);
      setCurrentUser(session.user);
      setToken(session.token);
      redirectBasedOnRole(session.user.role);
    }
  }, []);

  // Helpers
  const saveUsers = (newUsers) => {
    setUsers(newUsers);
    localStorage.setItem("pvt_users", JSON.stringify(newUsers));
  };

  const saveVisits = (newVisits) => {
    setVisits(newVisits);
    localStorage.setItem("pvt_visits", JSON.stringify(newVisits));
  };

  const redirectBasedOnRole = (role) => {
    if (role === "clinician") setCurrentView("clinician");
    else if (role === "patient") setCurrentView("patient");
    else if (role === "admin") setCurrentView("admin");
  };

  const handleLogin = (email, password) => {
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );
    if (user) {
      const mockToken = `token_${Date.now()}`;
      setCurrentUser(user);
      setToken(mockToken);
      sessionStorage.setItem(
        "pvt_session",
        JSON.stringify({ user, token: mockToken }),
      );
      redirectBasedOnRole(user.role);
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setToken(null);
    setCurrentView("login");
    sessionStorage.removeItem("pvt_session");
    setMobileMenuOpen(false);
  };

  // --- Views ---

  const LoginView = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-teal-600 p-8 text-center">
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Activity className="text-white w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white">MediTrack</h1>
            <p className="text-teal-100 mt-2">
              Patient Visit Management System
            </p>
          </div>

          <div className="p-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin(email, password);
              }}
            >
              <Input
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <Button
                onClick={() => handleLogin(email, password)}
                type="submit"
                className="w-full mt-6"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-8 text-xs text-gray-500 text-center border-t pt-4">
              <p className="font-semibold mb-2">Demo Credentials:</p>
              <p>Clinician: dr.smith@hospital.com / password123</p>
              <p>Patient: john@patient.com / password123</p>
              <p>Admin: admin@hospital.com / admin</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CreateRecordView = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("patient");
    const [successMsg, setSuccessMsg] = useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
      if (users.find((u) => u.email === email)) {
        alert("User with this email already exists");
        return;
      }
      const newUser = { id: generateId(), name, email, password, role };
      saveUsers([...users, newUser]);
      setSuccessMsg(`Successfully created ${role}: ${name}`);
      setName("");
      setEmail("");
      setPassword("");
      setTimeout(() => setSuccessMsg(""), 3000);
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-teal-600" />
            Register New User
          </h3>

          {successMsg && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-200">
              {successMsg}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="md:col-span-2">
              <Select
                label="Account Type"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                options={[
                  { value: "patient", label: "Patient" },
                  { value: "clinician", label: "Clinician" },
                  { value: "admin", label: "Administrator" },
                ]}
              />
            </div>
            <Input
              placeholder={"Full Name"}
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              placeholder={"Email"}
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              placeholder={"Password"}
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="md:col-span-2 flex justify-end mt-2">
              <Button onClick={() => handleSubmit} type="submit">
                Create Account
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-0">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold text-gray-700">Existing Users</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {u.name}
                    </td>
                    <td className="px-6 py-3 capitalize">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          u.role === "clinician"
                            ? "bg-blue-100 text-blue-800"
                            : u.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-3">{u.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  const NewVisitForm = ({ onSuccess }) => {
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
      saveVisits([...visits, newVisit]);
      onSuccess();
      setPatientId("");
      setDiagnosis("");
      setNotes("");
    };

    return (
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-teal-600" />
          Record New Visit
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Select Patient"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              options={patients.map((p) => ({ value: p.id, label: p.name }))}
              required
            />
            <Input
              placeholder={"Date"}
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <Input
            label="Diagnosis"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="Primary diagnosis"
            required
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clinical Notes
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all h-24 resize-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detailed observations..."
              required
            ></textarea>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => handleSubmit} type="submit">
              Save Visit Record
            </Button>
          </div>
        </form>
      </Card>
    );
  };

  const VisitList = ({ filterUser = null, role }) => {
    // Logic:
    // If role is clinician, show all visits created BY them (or all if we want them to see everything).
    // If role is patient, show only visits FOR them.
    // If role is admin, show all.

    const filteredVisits = useMemo(() => {
      let v = [...visits].sort((a, b) => b.timestamp - a.timestamp);

      if (role === "patient") {
        v = v.filter((visit) => visit.patientId === currentUser.id);
      } else if (role === "clinician") {
        // Clinicians see visits they performed
        v = v.filter((visit) => visit.clinicianId === currentUser.id);
      }
      // Admin sees all

      return v;
    }, [visits, currentUser, role]);

    const getUserName = (id) =>
      users.find((u) => u.id === id)?.name || "Unknown";

    if (filteredVisits.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No visit records found.</p>
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {filteredVisits.map((visit) => (
          <Card
            key={visit.id}
            className="hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-5">
              <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-teal-50 text-teal-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                      {visit.date}
                    </span>
                    <h4 className="font-bold text-gray-900 text-lg">
                      {visit.diagnosis}
                    </h4>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium text-gray-500">
                        Patient:
                      </span>{" "}
                      {getUserName(visit.patientId)}
                    </p>
                    <p>
                      <span className="font-medium text-gray-500">
                        Clinician:
                      </span>{" "}
                      {getUserName(visit.clinicianId)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 leading-relaxed border border-gray-100">
                {visit.notes}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const DashboardLayout = ({ children }) => {
    const navItems = [
      { id: "dashboard", label: "Dashboard", icon: Activity, show: true },
      {
        id: "records",
        label: "User Management",
        icon: Users,
        show: currentUser.role === "admin" || currentUser.role === "clinician",
      },
    ];

    return (
      <div className="min-h-screen bg-slate-50 font-sans text-gray-900">
        {/* Navbar */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="bg-teal-600 p-1.5 rounded-lg">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight text-gray-900">
                  MediTrack
                </span>
                <span className="hidden sm:inline-block px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 capitalize ml-2">
                  {currentUser.role} Portal
                </span>
              </div>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-4">
                <div className="text-sm text-gray-600 mr-2">
                  Welcome,{" "}
                  <span className="font-semibold text-gray-900">
                    {currentUser.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <div className="flex items-center md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  {mobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 bg-white p-4 space-y-2 shadow-lg">
              <div className="pb-3 border-b border-gray-100 mb-3">
                <p className="text-sm text-gray-500">Signed in as</p>
                <p className="font-semibold text-gray-900">
                  {currentUser.name}
                </p>
              </div>
              {currentUser.role === "admin" && (
                <button
                  onClick={() => {
                    setCurrentView("admin");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Users className="w-4 h-4" /> User Management
                </button>
              )}
              {(currentUser.role === "clinician" ||
                currentUser.role === "patient") && (
                <button
                  onClick={() => {
                    setCurrentView(
                      currentUser.role === "clinician"
                        ? "clinician"
                        : "patient",
                    );
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Activity className="w-4 h-4" /> Dashboard
                </button>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    );
  };

  // --- Router Logic ---

  if (currentView === "login") {
    return <LoginView />;
  }

  return (
    <DashboardLayout>
      {currentView === "clinician" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Clinician Dashboard
            </h2>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setCurrentView("admin")}
              >
                <Users className="w-4 h-4" /> Manage Records
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col: Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <NewVisitForm onSuccess={() => {}} />
              </div>
            </div>

            {/* Right Col: List */}
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Recent Visits
                </h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {
                    visits.filter((v) => v.clinicianId === currentUser.id)
                      .length
                  }{" "}
                  records
                </span>
              </div>
              <VisitList role="clinician" />
            </div>
          </div>
        </div>
      )}

      {currentView === "patient" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-800">
              My Health History
            </h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <VisitList role="patient" />
          </div>
        </div>
      )}

      {currentView === "admin" && (
        <div>
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() =>
                setCurrentView(
                  currentUser.role === "clinician" ? "clinician" : "admin",
                )
              }
              className="pl-0 hover:bg-transparent text-gray-500"
            >
              <ChevronRight className="w-4 h-4 rotate-180" /> Back to Dashboard
            </Button>
          </div>
          <CreateRecordView />
        </div>
      )}
    </DashboardLayout>
  );
}
