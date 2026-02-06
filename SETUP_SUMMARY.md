# API Integration Setup

React frontend has full API integration with your NestJS backend. Here's the set up:

### 📦 Files

1. **`app/utils/apiClient.ts`**
   - Axios instance with automatic JWT token injection
   - Request/Response interceptors
   - Auto-redirect to login on 401 errors

2. **`app/utils/authService.ts`**
   - Clinician login/register
   - Patient login/register
   - Token and user management
   - Authentication status checking

3. **`app/utils/clinicianService.ts`**
   - Get all clinicians
   - Get clinician details by ID or email
   - Get current clinician details

4. **`app/utils/patientService.ts`**
   - Get all patients
   - Get patient details by ID or email
   - Get current patient details

5. **`app/utils/visitsService.ts`**
   - Get visits for a user
   - Schedule new visits
   - Check-in/Check-out functionality
   - Get current user's visits

6. **`app/utils/useAuth.ts`** (React Hook)
   - Custom hook for authentication
   - Login/Register for both user types
   - Logout functionality
   - Loading and error states
   - User data management

7. **`app/utils/api.ts`** (Bundle Export)
   - Central import point for all services and hooks
   - Type exports

8. **`app/utils/helper.ts`** (Enhanced)
   - Added error handling utilities
   - Date formatting functions
   - Role checking utilities

9. **`API_INTEGRATION_GUIDE.md`**
   - Complete usage documentation
   - Code examples
   - Best practices

10. **`app/utils/API_USAGE_EXAMPLES.tsx`**
    - Practical example components
    - Ready-to-use implementations

### 🚀 Quick Start

#### In Your Components:

```typescript
import { useAuth, authService, visitsService } from "@/utils/api";

// Use the auth hook
const { user, isAuthenticated, clinicianLogin, logout } = useAuth();

// Or use services directly
await authService.clinicianLogin({ email: "...", password: "..." });
const visits = await visitsService.getCurrentUserVisits();
```

#### Environment Setup:

Your `.env` file already has:

```
REACT_PUBLIC_WOUNDTECH_BACKEND=http://localhost:3000
```

Change this URL for production deployments.

### 🔒 Security Features

- ✅ JWT tokens stored securely in localStorage
- ✅ Automatic token injection in all requests
- ✅ Automatic logout on token expiration (401)
- ✅ Type-safe API calls with TypeScript

### 🎯 Next Steps

1. **Update Your Login Component**
   - Replace current login logic with `useAuth` hook
   - See `API_USAGE_EXAMPLES.tsx` for reference

2. **Add Protected Routes**
   - Use `isAuthenticated` from `useAuth` hook
   - Redirect to login if not authenticated

3. **Integrate into Dashboards**
   - Use services to fetch dashboard data
   - Update user profiles
   - Manage visits

4. **Error Handling**
   - Use `error` state from `useAuth`
   - Use `getErrorMessage()` helper for display

### 📋 API Endpoints Available

**Authentication:**

- `POST /clinician/login`
- `POST /clinician` (register)
- `POST /patient/login`
- `POST /patient` (register)

**Clinician:**

- `GET /clinician/`
- `GET /clinician/detail?email=...&id=...`

**Patient:**

- `GET /patient/`
- `GET /patient/detail?email=...&id=...`

**Visits:**

- `GET /visits/:userId`
- `POST /visits` (schedule)
- `POST /visits/check-in`
- `POST /visits/check-out`

### 💡 Best Practices

1. Always use the `useAuth` hook in components that need auth state
2. Wrap API calls in try-catch for error handling
3. Use the helper functions for formatting errors and dates
4. Keep sensitive data (tokens) only in localStorage with proper CORS headers
5. Test endpoints in Postman/Insomnia before integration

### 🐛 Troubleshooting

**API Not Responding:**

- Check `REACT_PUBLIC_WOUNDTECH_BACKEND` URL
- Ensure backend is running on the correct port
- Check CORS headers on backend

**Login Not Working:**

- Verify email/password are correct
- Check network tab for response errors
- Ensure backend has `/clinician` and `/patient` routes

**Token Issues:**

- Clear localStorage and try again
- Check JWT expiration time in backend
- Verify token is being sent in Authorization header

---

For detailed examples and API documentation, see `API_INTEGRATION_GUIDE.md`
