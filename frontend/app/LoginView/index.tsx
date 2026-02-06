import { useState } from "react";
import { Input } from "../components/input";
import { Button } from "../components/button";
import { Activity } from "lucide-react";
import { useAuth } from "~/utils/useAuth";
import { Select } from "~/components/select";
import { useNavigate } from "react-router";
export const LoginView = () => {
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("clinician");
  const [isRegistering, setIsRegistering] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState(null);
  const {
    isLoading: authLoading,
    error: authError,
    clinicianLogin,
    patientLogin,
    clinicianRegister,
    patientRegister,
  } = useAuth();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      if (userType === "clinician") {
        await clinicianLogin({ email, password });
        navigate("/clinician");
      } else {
        await patientLogin({ email, password });
        navigate("/patient");
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();
    try {
      if (userType === "clinician") {
        await clinicianRegister({ email, password, firstName, lastName });
      } else {
        await patientRegister({ email, password, firstName, lastName });
      }
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-teal-600 p-8 text-center">
          <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Activity className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">WoundTech</h1>
          <p className="text-teal-100 mt-2">Patient Visit Management System</p>
        </div>

        <div className="p-8">
          {(authError || error) && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
              {authError || error}
            </div>
          )}

          <div className="mb-4 flex gap-2 border-b border-gray-200">
            <button
              onClick={() => {
                setIsRegistering(false);
                setFirstName("");
                setLastName("");
              }}
              className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
                !isRegistering
                  ? "border-teal-600 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsRegistering(true)}
              className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
                isRegistering
                  ? "border-teal-600 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign Up
            </button>
          </div>

          <Select
            label="User Type"
            value={userType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setUserType(e.target.value)
            }
            options={[
              { value: "clinician", label: "Clinician" },
              { value: "patient", label: "Patient" },
            ]}
          />

          {isRegistering ? (
            <form onSubmit={handleRegister}>
              <Input
                label="First Name"
                value={firstName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFirstName(e.target.value)
                }
                placeholder="First name"
                required
              />
              <Input
                label="Last Name"
                value={lastName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setLastName(e.target.value)
                }
                placeholder="Last name"
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                required
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                required
              />
              <Button
                type="submit"
                className="w-full mt-6"
                disabled={authLoading}
              >
                {authLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                required
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                required
              />
              <Button
                type="submit"
                className="w-full mt-6"
                disabled={authLoading}
              >
                {authLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
