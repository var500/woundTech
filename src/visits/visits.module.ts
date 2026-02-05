import { Module } from '@nestjs/common';
import { VisitsController } from './visits.controller';
import { VisitsService } from './visits.service';
import { visitProvider } from 'src/providers';
import { PatientModule } from '../patient/patient.module';
import { ClinicianModule } from '../clinician/clinician.module';

@Module({
  imports: [PatientModule, ClinicianModule],
  controllers: [VisitsController],
  providers: [VisitsService, visitProvider],
  exports: [VisitsService, visitProvider],
})
export class VisitsModule {}
