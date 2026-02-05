import { Model } from 'sequelize-typescript';

export type Providers = {
  provide: string;
  useValue: typeof Model<any, any>;
};

export const RoleCategories = {
  onlyClinician: ['clinician'],
  onlyPatient: ['patient'],
  ClinicianAndPatient: ['clinician', 'patient'],
};

export enum VisitStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
