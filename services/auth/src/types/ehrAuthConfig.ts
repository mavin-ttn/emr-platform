export interface EhRAuthConfig {
    authorizationUrl: string,
    tokenUrl: string,
    clientId: string,
    standaloneRedirectUrl: string,
    fhirApiBase: string,
    embeddedRedirectUrl: string,
    scope: string
}
