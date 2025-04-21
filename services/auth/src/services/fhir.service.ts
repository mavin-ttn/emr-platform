
type codeChallengeMethod = "S256";
type SMARTAuthenticationMethod = "client_secret_post" | "client_secret_basic" | "private_key_jwt";
type launchMode = "launch-ehr" | "launch-standalone";
type clientType = "client-public" | "client-confidential-symmetric";
type singleSignOn = "sso-openid-connect";
type launchContext = "context-banner" | "context-style";
type launchContextEHR = "context-ehr-patient" | "context-ehr-encounter";
type launchContextStandalone = "context-standalone-patient" | "context-standalone-encounter";
type permissions = "permission-offline" | "permission-patient" | "permission-user" | "permission-online" | "permission-v1" | "permission-v2";

interface WellKnownSmartConfiguration {
  /**
   * CONDITIONAL, String conveying this system’s OpenID Connect Issuer URL. 
   * Required if the server’s capabilities include sso-openid-connect; otherwise, omitted.
   */
  issuer: string;
  /**
   * CONDITIONAL, String conveying this system’s JSON Web Key Set URL. 
   * Required if the server’s capabilities include sso-openid-connect; otherwise, optional.
   */
  jwks_uri: string;
  /**
   * REQUIRED, Array of grant types supported at the token endpoint. The options are “authorization_code” 
   * (when SMART App Launch is supported) and “client_credentials” (when SMART Backend Services is supported).
   */
  grant_types_supported: Array<'client_secret_basic' | 'client_credentials'>;
  /**
   * CONDITIONAL, URL to the OAuth2 authorization endpoint.
   * Required if server supports the launch-ehr or launch-standalone capability; otherwise, optional.
   */
  authorization_endpoint: string;

  /**
   * URL to the OAuth2 token endpoint.
   */
  token_endpoint: string;

  /**
   * If available, URL to the OAuth2 dynamic registration endpoint for the
   * FHIR server.
   */
  registration_endpoint?: string;

  /**
   * RECOMMENDED! URL where an end-user can view which applications currently
   * have access to data and can make adjustments to these access rights.
   */
  management_endpoint?: string;

  /**
   * RECOMMENDED! URL to a server’s introspection endpoint that can be used
   * to validate a token.
   */
  introspection_endpoint?: string;

  /**
   * RECOMMENDED! URL to a server’s revoke endpoint that can be used to
   * revoke a token.
   */
  revocation_endpoint?: string;

  /**
   * RECOMMENDED! PKCE challenge methods the server supports.
   */
  code_challenge_methods_supported?: codeChallengeMethod[];

  /**
   * Array of client authentication methods supported by the token endpoint.
   * The options are “client_secret_post” and “client_secret_basic”.
   */
  token_endpoint_auth_methods_supported?: SMARTAuthenticationMethod[];

  /**
   * Array of scopes a client may request.
   */
  scopes_supported?: string[];

  /**
   * Array of OAuth2 response_type values that are supported
   */
  response_types_supported?: string[];

  /**
   * Array of strings representing SMART capabilities (e.g., single-sign-on
   * or launch-standalone) that the server supports.
   */
  capabilities: Array<
    SMARTAuthenticationMethod |
    launchMode |
    clientType |
    singleSignOn |
    launchContext |
    launchContextEHR |
    launchContextStandalone |
    permissions
  >;

  associated_endpoints: {url: string, capabilities: string[]}[]
}

/**
 * Get FHIR OAuth authorization endpoints and SMART Capabilities it supports
 * @doc https://build.fhir.org/ig/HL7/smart-app-launch/conformance.html#using-well-known
 */
export const getWellKnownSmartConfiguration = async (
  fhirServerUrl: string
): Promise<WellKnownSmartConfiguration> => {
  try {
    const smartConfigUrl = `${fhirServerUrl}/.well-known/smart-configuration`;
    const response = await fetch(smartConfigUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const smartConfig = await response.json();
    console.log(smartConfig)
    return smartConfig;
  } catch (error) {
    console.error(
      `Error while getting .well-known/smart-configuration from Issuer (FHIR Server): ${fhirServerUrl}`,
      error
    );
    throw error;
  }
};