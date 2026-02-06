### 🚀 Quick Start

```

#### Environment Setup:

`.env` file already has:

```

REACT_PUBLIC_WOUNDTECH_BACKEND=http://localhost:3000

```

Change this URL for production deployments.

### 🔒 Security Features

- ✅ JWT tokens stored securely in localStorage
- ✅ Automatic token injection in all requests
- ✅ Automatic logout on token expiration (401)
- ✅ Type-safe API calls with TypeScript



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

- `GET /visits?userId=${userId}`
- `POST /visits` (schedule)
- `POST /visits/check-in`
- `POST /visits/check-out`

```
