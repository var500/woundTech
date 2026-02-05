import { ChevronRight, UserPlus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "~/components/card";
import { Select } from "~/components/select";
import { Input } from "~/components/input";
import { Button } from "~/components/button";
import { generateId } from "~/utils/helper";

export const AdminDashboard = ({ users, setUsers, currentUser }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (users.find((u) => u.email === email)) return alert("User exists");
    setUsers([...users, { id: generateId(), name, email, password, role }]);
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Link to="/clinician" className="text-gray-500 hover:text-gray-700">
          <ChevronRight className="w-4 h-4 rotate-180" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
      </div>
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-teal-600" /> Register User
        </h3>
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
                { value: "admin", label: "Admin" },
              ]}
            />
          </div>
          <Input
            placeholder={"Name"}
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            placeholder={"Email"}
            label="Email"
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
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Card>
      <Card className="p-0">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-500">
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
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-3">{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
