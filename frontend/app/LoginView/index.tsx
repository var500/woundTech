import { useState } from "react";
import { Input } from "../components/input";
import { Button } from "../components/button";
import { Activity } from "lucide-react";

export const LoginView = ({ onLogin }) => {
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
          <p className="text-teal-100 mt-2">Patient Visit Management System</p>
        </div>
        <div className="p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onLogin(email, password);
            }}
          >
            <Input
              placeholder={"Email Address"}
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              placeholder={"password"}
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              onClick={() => onLogin(email, password)}
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
