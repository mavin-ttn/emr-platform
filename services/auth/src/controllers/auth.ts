import { Request, Response } from 'express';
import { ehrAuthConfig } from '../config';
import { EhrProvider, HttpStatusCode, HttpMethod } from '../enums';

/**
 * @description Requests an Authorization Code from auth server
 */
export const standaloneLaunch = (req: Request, res: Response): void => {
    const provider = req.params.provider as EhrProvider;

    if (!provider) {
        console.log('Missing emr param')
        res.status(HttpStatusCode.BAD_REQUEST).send('Missing emr param');
        return
    }

    const authConfig = ehrAuthConfig[provider]
    try {
        const authParams = new URLSearchParams({
            /**
             * This parameter must contain the value "code".
             */
            response_type: "code",
            // client_secret: '...' // Only if needed
            client_id: authConfig.clientId,
            /**
             * Redirect_uri parameter contains your application's redirect URI. After the request completes on the Epic server, 
             * this URI will be called as a callback. The value of this parameter needs to be URL encoded.
             * his URI must also be registered with the EHR's authorization server by adding it to your app listing
             */
            redirect_uri: authConfig.standaloneRedirectUrl,
            /**
             * This parameter describes the information for which the web application is requesting access.
             * @doc https://hl7.org/fhir/smart-app-launch/1.0.0/scopes-and-launch-context/index.html
             */
            scope: authConfig.scope,
            /**
             * URL of the resource server the application intends to access, which is typically the FHIR server.
             */
            aud: authConfig.fhirApiBase,
            state: provider,
        });
        const redirectUrl = `${authConfig.authorizationUrl}?${authParams.toString()}`;
        console.log('Redirecting:', redirectUrl)
        res.redirect(redirectUrl);

    } catch (error) {
        console.error('Error:', (error as Error).message);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send('Internal server error');
    }
};

/**
 * @description Handles the callback after a user authorizes your app with Epic.
 */
export const standaloneLaunchCallback = async (req: Request, res: Response): Promise<void> => {
    const { code, state } = req.query;
    const authConfig = ehrAuthConfig[state as EhrProvider]

    if (typeof code !== 'string') {
        res.status(HttpStatusCode.BAD_REQUEST).send('Missing or invalid code');
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
            redirect_uri: authConfig.standaloneRedirectUrl,
            client_id: authConfig.clientId,
            // client_secret: '...' // Only if needed
        });

        // Exchanges the Authorization Code for an Access Token
        const response = await fetch(authConfig.tokenUrl, {
            method: HttpMethod.POST,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Token exchange failed:', errorData);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send('Token exchange failed');
            return;
        }

        const data = await response.json()
        console.log(data)

        const { access_token, token_type, id_token, scope } = data;
        res.json({ access_token, token_type, id_token, scope });

    } catch (error) {
        console.error('Error:', (error as Error).message);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send('Internal server error');
    }
};

function getEhrProviderByIssuer(fhirApiBase: string): EhrProvider {
    return Object.entries(ehrAuthConfig).find(
        ([, config]) => config.fhirApiBase === fhirApiBase
    )?.[0] as EhrProvider;
}

/**
 * Your app is launched by the EHR calling the launch URL which is specified in the EHR's configuration. 
 * The EHR sends a launch token and the FHIR server's endpoint URL (ISS parameter).
 */
let tokenUrl: string
export const embeddedLaunch = async (req: Request, res: Response): Promise<any> => {
    const fhirServerUrl: any = req.query.iss!;
    const launchContext: any = req.query.launch!;
    const ehrProvider = getEhrProviderByIssuer(fhirServerUrl)
    const allowedIssuers = [
        ehrAuthConfig[EhrProvider.EPIC].fhirApiBase,
        ehrAuthConfig[EhrProvider.CERNER].fhirApiBase
    ];

    if (!allowedIssuers.includes(fhirServerUrl)) {
        console.warn(`Blocked launch attempt from unknown iss: ${fhirServerUrl}`);
        return res.status(HttpStatusCode.UNAUTHORIZED).send('Unauthorized EHR system.');
    }

    const authConfig = ehrAuthConfig[ehrProvider]


    if (!fhirServerUrl || !launchContext) {
        console.log('Missing iss or launch parameter')
        return res.status(HttpStatusCode.BAD_REQUEST).send('Missing iss or launch parameter.');
    }

    try {
        // Discover authorization and token endpoint. Alternatively, /metadata cas be used as fallback
        const smartConfigUrl = `${fhirServerUrl}/.well-known/smart-configuration`;
        const smartConfigResponse = await fetch(smartConfigUrl);
        const smartConfig: {
            authorization_endpoint: string,
            token_endpoint: string,
            token_endpoint_auth_methods_supported: string[]
        } = await smartConfigResponse.json();
        const authorizeUrl = smartConfig.authorization_endpoint;
        tokenUrl = smartConfig.token_endpoint;

        const authParams = new URLSearchParams({
            /**
             * This parameter must contain the value "code".
             */
            response_type: "code",
            /**
             * This parameter contains your web application's client ID issued by Epic
             */
            client_id: authConfig.clientId,
            /**
             * This parameter contains your application's redirect URI. After the request completes on the Epic server, 
             * this URI will be called as a callback. The value of this parameter needs to be URL encoded. 
             * This URI must also be registered with the EHR's authorization server by adding it to your app listing.
             */
            redirect_uri: authConfig.embeddedRedirectUrl,
            /**
             * This parameter describes the information for which the web application is requesting access.
             * @doc https://hl7.org/fhir/smart-app-launch/1.0.0/scopes-and-launch-context/index.html
             */
            scope: "launch patient/*.read",
            /**
             * This parameter is required for EHR launch workflows. The value to use will be passed from the EHR
             */
            launch: launchContext.toString(),
            /**
             * The value to use is the FHIR base URL of the resource server the application intends to access,
             * which is typically the FHIR server returned by the iss.
             */
            aud: fhirServerUrl.toString(),
            state: ehrProvider
        });

        // Redeem launch token for authorization code
        const redirectUrl = `${authorizeUrl}?${authParams.toString()}`;
        console.log('Redirecting:', redirectUrl)
        res.redirect(redirectUrl);

    } catch (error) {
        console.error(error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send("Failed to launch");
    }
}

export const embeddedLaunchCallback = async (req: Request, res: Response): Promise<any> => {
    const { code, state } = req.query;

    console.log(req.query)
    if (!code) {
        return res.status(HttpStatusCode.BAD_REQUEST).send('Missing authorization code.');
    }

    const authConfig = ehrAuthConfig[state as EhrProvider]

    try {

        // Exchanges the Authorization Code for an Access Token
        const tokenParams = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code as string,
            client_id: authConfig.clientId,
            redirect_uri: authConfig.embeddedRedirectUrl,
        });
        const tokenResponse = await fetch(tokenUrl, {
            method: HttpMethod.POST,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: tokenParams.toString(),
        });

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error('Token exchange failed:', errorText);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send('Error exchanging code for token');
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token as string;

        res.send(`Access token received! ${accessToken}`);
    } catch (err) {
        console.error('Unexpected error during token exchange:', err);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send('Unexpected error during token exchange');
    }
}

module.exports = { standaloneLaunch, standaloneLaunchCallback, embeddedLaunch, embeddedLaunchCallback }
