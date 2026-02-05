// --- Mock Data ---
export const SEED_USERS = [
  {
    id: "u1",
    name: "Dr. Sarah Smith",
    email: "dr.smith@hospital.com",
    role: "clinician",
    password: "password123",
  },
  {
    id: "u2",
    name: "John Doe",
    email: "john@patient.com",
    role: "patient",
    password: "password123",
  },
  {
    id: "u3",
    name: "Admin User",
    email: "admin@hospital.com",
    role: "admin",
    password: "admin",
  },
];

export const SEED_VISITS = [
  {
    id: "v1",
    clinicianId: "u1",
    patientId: "u2",
    date: "2023-10-25",
    diagnosis: "Seasonal Flu",
    notes: "Prescribed rest and fluids.",
    timestamp: 1698200000000,
  },
  {
    id: "v2",
    clinicianId: "u1",
    patientId: "u2",
    date: "2023-11-10",
    diagnosis: "Follow-up",
    notes: "Patient recovered fully.",
    timestamp: 1699600000000,
  },
];
