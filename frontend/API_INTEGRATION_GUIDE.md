# API Integration Guide

This guide shows how to use the API integration services in your WoundTech frontend.

## Services Available

### 1. **Auth Service** (`authService.ts`)

Handles authentication for both clinicians and patients.

```typescript
import authService from "@/utils/authService";

// Clinician login
await authService.clinicianLogin({
  email: "clinician@example.com",
  password: "password",
});

// Patient registration
await authService.patientRegister({
  email: "patient@example.com",
  password: "password",
  firstName: "John",
  lastName: "Doe",
});

// Logout
authService.logout();

// Check if authenticated
if (authService.isAuthenticated()) {
  console.log("User is logged in");
}

// Get stored user
const user = authService.getUser();
```

### 2. **Clinician Service** (`clinicianService.ts`)

Manages clinician-related operations.

```typescript
import clinicianService from "@/utils/clinicianService";

// Get all clinicians
const clinicians = await clinicianService.getList();

// Get clinician by ID
const clinician = await clinicianService.getDetail({ id: "clinician-id" });

// Get clinician by email
const clinician = await clinicianService.getDetail({
  email: "clinician@example.com",
});

// Get current logged-in clinician's details
const currentClinicianDetails =
  await clinicianService.getCurrentClinicianDetails();
```

### 3. **Patient Service** (`patientService.ts`)

Manages patient-related operations.

```typescript
import patientService from "@/utils/patientService";

// Get all patients
const patients = await patientService.getList();

// Get patient by ID
const patient = await patientService.getDetail({ id: "patient-id" });

// Get patient by email
const patient = await patientService.getDetail({
  email: "patient@example.com",
});

// Get current logged-in patient's details
const currentPatientDetails = await patientService.getCurrentPatientDetails();
```

### 4. **Visits Service** (`visitsService.ts`)

Manages visit scheduling and check-in/check-out operations.

```typescript
import visitsService from "@/utils/visitsService";

// Get visits for a user
const visits = await visitsService.getVisits("user-id");

// Schedule a new visit
const newVisit = await visitsService.scheduleVisit({
  userId: "patient-id",
  scheduledDate: new Date("2024-02-15"),
  notes: "Follow-up visit",
});

// Check in to a visit
const checkedInVisit = await visitsService.checkIn("visit-id");

// Check out from a visit
const checkedOutVisit = await visitsService.checkOut("visit-id");

// Get current user's visits
const userVisits = await visitsService.getCurrentUserVisits();
```

## Using the useAuth Hook (Recommended for React Components)

```typescript
import { useAuth } from '@/utils/useAuth';

export function LoginComponent() {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    clinicianLogin,
    logout
  } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await clinicianLogin({ email, password });
      // User is now logged in
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  if (isAuthenticated) {
    return (
      <div>
        <p>Welcome, {user?.email}</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return (
    <div>
      {error && <p className="error">{error}</p>}
      <button
        onClick={() => handleLogin('test@example.com', 'password')}
        disabled={isLoading}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </div>
  );
}
```

## Authentication Flow

1. **Token Storage**: JWTs are automatically stored in `localStorage` under the key `access_token`
2. **Automatic Token Injection**: All API requests automatically include the JWT in the `Authorization` header
3. **Token Expiration**: If a 401 error is received, the token is cleared and user is redirected to `/login`
4. **User Data**: User information is stored in `localStorage` under the key `user`

## Environment Variables

The API base URL is configured in `.env`:

```
REACT_PUBLIC_WOUNDTECH_BACKEND=http://localhost:3000
```

Change this to your backend URL (e.g., for production deployment).

## Error Handling

All services use try-catch. Errors are automatically caught and can be handled:

```typescript
try {
  await clinicianService.getDetail({ id: "clinician-id" });
} catch (error) {
  const message = error.response?.data?.message || error.message;
  console.error("Error:", message);
}
```

## Protected Routes

Use the `useAuth` hook to protect routes:

```typescript
import { useAuth } from '@/utils/useAuth';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}
```

## Next Steps

1. Update your login/register components to use `useAuth` hook
2. Add error handling and loading states
3. Create protected routes for authenticated pages
4. Integrate the services into your dashboard components
