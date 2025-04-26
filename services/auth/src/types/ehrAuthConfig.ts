type Role = 'patient' | 'practitioner';

export interface EhRAuthConfig {
  authorizationUrl: string;
  tokenUrl: string;
  clientId: Record<Role, string>;
  standaloneRedirectUrl: string;
  fhirApiBase: string;
  embeddedRedirectUrl: string;
  scope: string;
}
