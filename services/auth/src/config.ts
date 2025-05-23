import { EhrProvider } from './enums/ehrProvider';
import { EhRAuthConfig, AppConfig } from './types';
require('dotenv').config();

export const appConfig: AppConfig = {
  port: process.env.PORT! || '3000',
  host: process.env.HOST!,
  origin: `${process.env.HOST}:${process.env.PORT}`,
};

export const ehrAuthConfig: Record<EhrProvider, EhRAuthConfig> = {
  [EhrProvider.EPIC]: {
    authorizationUrl: process.env.EPIC_AUTH_URL!,
    tokenUrl: process.env.EPIC_TOKEN_URL!,
    clientId: {
      patient: process.env.EPIC_PATIENT_CLIENT_ID!,
      practitioner: process.env.EPIC_PROVIDER_CLIENT_ID!,
      practitionerStu3: process.env.EPIC_PROVIDER_CLIENT_ID_STU3!,
    },
    standaloneRedirectUrl: appConfig.origin + '/auth/callback',
    embeddedRedirectUrl: appConfig.origin + '/auth/embeddedCallback',
    fhirApiBase: process.env.EPIC_FHIR_API_BASE!,
    scope:
      'openid profile user/Patient.read patient/MedicationRequest.write Practitioner.read patient/Condition.read patient/Procedure.read patient/Observation.read',
  },
  [EhrProvider.CERNER]: {
    authorizationUrl: process.env.CERNER_AUTH_URL!,
    tokenUrl: process.env.CERNER_TOKEN_URL!,
    clientId: {
      patient: process.env.CERNER_PATIENT_CLIENT_ID!,
      practitioner: process.env.CERNER_PROVIDER_CLIENT_ID!,
      practitionerStu3: '',
    },
    standaloneRedirectUrl: appConfig.origin + '/auth/callback',
    embeddedRedirectUrl: appConfig.origin + '/auth/embeddedCallback',
    fhirApiBase: process.env.CERNER_FHIR_API_BASE!,
    scope:
      'openid profile user/Patient.read user/Patient.write fhirUser patient/Patient.write',
  },
};
