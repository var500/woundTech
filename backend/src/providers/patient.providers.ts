import { Providers } from 'src/common';
import { Patient } from 'src/models/patients.schema';

export const patientProvider: Providers = {
  provide: 'PATIENT_REPOSITORY',
  useValue: Patient,
};
