import { Module } from '@nestjs/common';
import { ClinicianService } from './clinician.service';
import { ClinicianController } from './clinician.controller';
import { clinicianProvider } from '../providers';

@Module({
  controllers: [ClinicianController],
  providers: [ClinicianService, clinicianProvider],
  exports: [clinicianProvider],
})
export class ClinicianModule {}
