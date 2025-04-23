import { EhrProvider } from './enums/ehrProvider'
import { EhRAuthConfig, AppConfig } from './types';
require('dotenv').config();

export const appConfig: AppConfig = {
    port: process.env.PORT! || '3000',
    host: process.env.HOST!,
    origin: `${process.env.HOST}:${process.env.PORT}`,
}

export const ehrAuthConfig: Record<EhrProvider, EhRAuthConfig> = {
    [EhrProvider.EPIC]: {
        authorizationUrl: process.env.EPIC_AUTH_URL!,
        tokenUrl: process.env.EPIC_TOKEN_URL!,
        clientId: process.env.EPIC_CLIENT_ID!,
        standaloneRedirectUrl: appConfig.origin + '/auth/callback',
        embeddedRedirectUrl: appConfig.origin + '/auth/embeddedCallback',
        fhirApiBase: process.env.EPIC_FHIR_API_BASE!,
        scope: 'openid profile user/Patient.read patient/MedicationRequest.write'
    },
    [EhrProvider.CERNER]: {
        authorizationUrl: process.env.CERNER_AUTH_URL!,
        tokenUrl: process.env.CERNER_TOKEN_URL!,
        clientId: process.env.CERNER_CLIENT_ID!,
        standaloneRedirectUrl: appConfig.origin + '/auth/callback',
        embeddedRedirectUrl: appConfig.origin + '/auth/embeddedCallback',
        fhirApiBase: process.env.CERNER_FHIR_API_BASE!,
        scope: 'openid profile user/Patient.read'
    }
}