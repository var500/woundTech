import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("clinician", "routes/clinician.tsx"),
  route("patient", "routes/patient.tsx"),
] satisfies RouteConfig;
