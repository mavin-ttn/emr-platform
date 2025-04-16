export const proxyRoutes = [
  {
    path: "/auth",
    target: process.env.AUTH_SERVICE_URL || "http://localhost:3000",
  },
  {
    path: "/fhir",
    target: process.env.FHIR_SERVICE_URL || "http://localhost:5000",
  },
];
