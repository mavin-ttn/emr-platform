export interface MessageHeader {
  messageId: string;
  messageType: string;
  timestamp: string;
}

export interface Name {
  firstName: string;
  lastName: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface Phone {
  number: string;
  type: string;
  use: string;
}

export interface Patient {
  mrn: string;
  name: Name;
  dob: string;
  gender: string;
  address: Address;
  phones: Phone[];
}

export interface Physician {
  id: string;
  name: string;
}

export interface Location {
  facility: string;
  department: string;
}

export interface Visit {
  visitId?: string;
  admissionDate?: string;
  location: Location;
  attendingPhysician: Physician;
}

export interface Observation {
  type: string;
  value: string;
  unit: string;
  comment: string;
}

export interface Allergy {
  substance: string;
  reaction: string;
  onsetDate?: string;
}

export interface Diagnosis {
  code: string;
  description: string;
  date: string;
}

export interface Insurance {
  company: string;
  planId: string;
  groupNumber?: string;
  subscriberId?: string;
}

export interface PatientData {
  messageHeader: MessageHeader;
  patient: Patient;
  visit: Visit;
  observations: Observation[];
  allergies: Allergy[];
  diagnosis: Diagnosis[];
  insurance: Insurance;
}

// Define props export interface
export interface PatientDashboardProps {
  patientData: PatientData;
}

