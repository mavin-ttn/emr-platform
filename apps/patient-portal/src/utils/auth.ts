export interface AuthInfo {
  token: string;
  patientId?: string;
  userId?: string;
}

export const getAuthInfo = (): AuthInfo | null => {
  const token = localStorage.getItem("access_token") || undefined;
  const rawPatientId = localStorage.getItem("patient_id");
  const patientId =
    rawPatientId && rawPatientId !== "undefined" ? rawPatientId : undefined;
  const userId = patientId || localStorage.getItem("id") || undefined;

  if (!token) {
    console.warn("No access token found!");
    return null;
  }

  return { token, patientId, userId };
};
