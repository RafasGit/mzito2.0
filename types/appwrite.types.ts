import { Models } from "node-appwrite";


export interface Patient extends Models.Document {
  //userId: string;
  name: string;
  //email: string;
  phone: string;
  primaryPhysician: string;
  // insuranceProvider: string;
  // insurancePolicyNumber: string;
  // allergies: string | undefined;
  // currentMedication: string | undefined;
  // familyMedicalHistory: string | undefined;
  // pastMedicalHistory: string | undefined;
  // identificationType: string | undefined;
  // identificationNumber: string | undefined;
  // identificationDocument: FormData | undefined;
  // privacyConsent: boolean;
}

export interface Appointment extends Models.Document {
  patient: Patient;
  schedule: Date;
  status: Status;
  primaryPhysician: string;
  reason: string;
  note: string;
 // userId: string;
  cancellationReason: string | null;
}

export interface Transaction extends Models.Document {
  name: string;
 // email: string;
  phone: string;
  appointmentId: string;
}

