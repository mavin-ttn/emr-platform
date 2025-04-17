import { Request, Response } from 'express';
let client_id = process.env.EPIC_PATIENT_CLIENT_ID;
/**
 * @description Requests an Authorization Code from auth server
 */
export const standaloneLaunch = (req: Request, res: Response): void => {
  try {
    const role = req.query.role || 'patient';
    client_id =
      role === 'patient'
        ? process.env.EPIC_PATIENT_CLIENT_ID
        : process.env.EPIC_PROVIDER_CLIENT_ID;
    const authParams = new URLSearchParams({
      /**
       * This parameter must contain the value "code".
       */
      response_type: 'code',
      // client_secret: '...' // Only if needed
      client_id: client_id as string,
      /**
       * Redirect_uri parameter contains your application's redirect URI. After the request completes on the Epic server,
       * this URI will be called as a callback. The value of this parameter needs to be URL encoded.
       * his URI must also be registered with the EHR's authorization server by adding it to your app listing
       */
      redirect_uri: process.env.STANDALONE_REDIRECT_URI as string,
      /**
       * This parameter describes the information for which the web application is requesting access.
       * @doc https://hl7.org/fhir/smart-app-launch/1.0.0/scopes-and-launch-context/index.html
       */
      scope:
        'launch openid fhirUser patient/Patient.write patient/*.read user/Practitioner.read user/Patient.write Practitioner.read offline_access',
      /**
       * URL of the resource server the application intends to access, which is typically the FHIR server.
       */
      aud: process.env.FHIR_API_BASE as string,
    });
    const redirectUrl = `${process.env.EPIC_AUTH_URL}?${authParams.toString()}`;
    console.log('Redirecting:', redirectUrl);
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Error:', (error as Error).message);
    res.status(500).send('Internal server error');
  }
};

/**
 * @description Handles the callback after a user authorizes your app with Epic.
 */
export const standaloneLaunchCallback = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { code } = req.query;

  if (typeof code !== 'string') {
    res.status(400).send('Missing or invalid code');
    return;
  }

  try {
    const params = new URLSearchParams({
      /**
       * For the Standalone launch flow, this should contain the value "authorization_code"
       */
      grant_type: 'authorization_code',
      /**
       * This parameter contains the authorization code sent from Epic's authorization server to your
       * application as a querystring parameter on the redirect URI
       */
      code,
      /**
       * This parameter must contain the same redirect URI that you provided in the initial access request.
       * The value of this parameter needs to be URL encoded.
       */
      redirect_uri: process.env.STANDALONE_REDIRECT_URI as string,
      client_id: client_id as string,
      // client_secret: '...' // Only if needed
    });

    // Exchanges the Authorization Code for an Access Token
    const response = await fetch(process.env.EPIC_TOKEN_URL as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Token exchange failed:', errorData);
      res.status(500).send('Token exchange failed');
      return;
    }

    const data = await response.json();
    console.log(data);

    const { access_token, token_type, id_token, scope, patient } = data;
    // res.json({ access_token, token_type, id_token, scope });

    // Redirect back to frontend with the access token
    const token = data.access_token;
    const redirectUrl = `http://localhost:5173/callback?access_token=${token}&patient=${patient}`;

    // Redirect the user to the frontend with the token as a query parameter
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Error:', (error as Error).message);
    res.status(500).send('Internal server error');
  }
};

/**
 * Your app is launched by the EHR calling the launch URL which is specified in the EHR's configuration.
 * The EHR sends a launch token and the FHIR server's endpoint URL (ISS parameter).
 */
let tokenUrl: string;
export const embeddedLaunch = async (
  req: Request,
  res: Response
): Promise<any> => {
  const fhirServerUrl: any = req.query.iss as string;
  const launchContext: any = req.query.launch as string;
  const allowedIssuers = [
    'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4',
    'https://fhir.cerner.com/r4',
    // add all trusted FHIR base URLs here
  ];

  if (!allowedIssuers.includes(fhirServerUrl)) {
    console.warn(`Blocked launch attempt from unknown iss: ${fhirServerUrl}`);
    return res.status(403).send('Unauthorized EHR system.');
  }

  if (!fhirServerUrl || !launchContext) {
    return res.status(400).send('Missing iss or launch parameter.');
  }

  try {
    // Discover authorization and token endpoint. Alternatively, /metadata cas be used as fallback
    const smartConfigUrl = `${fhirServerUrl}/.well-known/smart-configuration`;
    const smartConfigResponse = await fetch(smartConfigUrl);
    const smartConfig: {
      authorization_endpoint: string;
      token_endpoint: string;
      token_endpoint_auth_methods_supported: string[];
    } = await smartConfigResponse.json();
    const authorizeUrl = smartConfig.authorization_endpoint;
    tokenUrl = smartConfig.token_endpoint;

    const authParams = new URLSearchParams({
      /**
       * This parameter must contain the value "code".
       */
      response_type: 'code',
      /**
       * This parameter contains your web application's client ID issued by Epic
       */
      client_id: process.env.CLIENT_ID as string,
      /**
       * This parameter contains your application's redirect URI. After the request completes on the Epic server,
       * this URI will be called as a callback. The value of this parameter needs to be URL encoded.
       * This URI must also be registered with the EHR's authorization server by adding it to your app listing.
       */
      redirect_uri: process.env.EMBEDDED_REDIRECT_URI as string,
      /**
       * This parameter describes the information for which the web application is requesting access.
       * @doc https://hl7.org/fhir/smart-app-launch/1.0.0/scopes-and-launch-context/index.html
       */
      scope: 'user/Patient.read',
      /**
       * This parameter is required for EHR launch workflows. The value to use will be passed from the EHR
       */
      launch: launchContext.toString(),
      /**
       * The value to use is the FHIR base URL of the resource server the application intends to access,
       * which is typically the FHIR server returned by the iss.
       */
      aud: fhirServerUrl.toString(),
    });

    // Redeem launch token for authorization code
    const redirectUrl = `${authorizeUrl}?${authParams.toString()}`;
    console.log('Redirecting:', redirectUrl);
    res.redirect(redirectUrl);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to launch');
  }
};

export const embeddedLaunchCallback = async (
  req: Request,
  res: Response
): Promise<any> => {
  const codeParam = Array.isArray(req.query.code)
    ? req.query.code[0]
    : req.query.code;
  const code = codeParam as string | undefined;
  console.log(req.query);
  if (!code) {
    return res.status(400).send('Missing authorization code.');
  }

  try {
    // Exchanges the Authorization Code for an Access Token
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      client_id: process.env.CLIENT_ID ?? '',
      redirect_uri: process.env.EMBEDDED_REDIRECT_URI ?? '',
    });
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenParams.toString(),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      return res.status(500).send('Error exchanging code for token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token as string;

    res.send(`Access token received! ${accessToken}`);
  } catch (err) {
    console.error('Unexpected error during token exchange:', err);
    res.status(500).send('Unexpected error during token exchange');
  }
};

module.exports = {
  standaloneLaunch,
  standaloneLaunchCallback,
  embeddedLaunch,
  embeddedLaunchCallback,
};
