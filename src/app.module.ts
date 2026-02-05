import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ClinicianModule } from './clinician/clinician.module';
import { AuthGuard } from './guards/auth';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { RolesGuard } from './guards/roles';
import { PatientModule } from './patient/patient.module';
import { VisitsModule } from './visits/visits.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    ClinicianModule,
    PatientModule,
    VisitsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    Reflector,
    AuthGuard,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
