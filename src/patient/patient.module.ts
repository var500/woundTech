import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { patientProvider } from 'src/providers';
import { PatientController } from './patient.controller';

@Module({
  controllers: [PatientController],
  providers: [PatientService, patientProvider],
  exports: [PatientService, patientProvider],
})
export class PatientModule {}
