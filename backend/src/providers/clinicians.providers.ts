import { Providers } from 'src/common';
import { Clinician } from '../models/clinicians.schema';

export const clinicianProvider: Providers = {
  provide: 'CLINICIAN_REPOSITORY',
  useValue: Clinician,
};
