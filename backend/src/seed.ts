import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClinicianService } from './clinician/clinician.service';
import { PatientService } from './patient/patient.service';
import { Register_USER_DTO } from './clinician/dtos/register.dtos';

async function seed() {
  const app = await NestFactory.create(AppModule);

  const clinicianService = app.get(ClinicianService);
  const patientService = app.get(PatientService);

  // Clinician data
  const clinicians: Register_USER_DTO[] = [
    {
      fname: 'Dr. James',
      lname: 'Smith',
      dob: '1985-05-15',
      gender: 'Male',
      mobile: '+1-555-0101',
      city: 'New York',
      address: '123 Medical Plaza, Suite 100',
      email: 'james.smith@clinic.com',
      password: 'SecurePass123!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
    },
    {
      fname: 'Dr. Sarah',
      lname: 'Johnson',
      dob: '1988-03-22',
      gender: 'Female',
      mobile: '+1-555-0102',
      city: 'Los Angeles',
      address: '456 Health Center Drive',
      email: 'sarah.johnson@clinic.com',
      password: 'SecurePass123!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    },
    {
      fname: 'Dr. Michael',
      lname: 'Brown',
      dob: '1982-07-10',
      gender: 'Male',
      mobile: '+1-555-0103',
      city: 'Chicago',
      address: '789 Wellness Boulevard',
      email: 'michael.brown@clinic.com',
      password: 'SecurePass123!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
    },
    {
      fname: 'Dr. Emily',
      lname: 'Davis',
      dob: '1990-01-12',
      gender: 'Female',
      mobile: '+1-555-0104',
      city: 'Houston',
      address: '321 Care Street, Floor 2',
      email: 'emily.davis@clinic.com',
      password: 'SecurePass123!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
    },
    {
      fname: 'Dr. Robert',
      lname: 'Wilson',
      dob: '1987-09-28',
      gender: 'Male',
      mobile: '+1-555-0105',
      city: 'Phoenix',
      address: '654 Medical Way',
      email: 'robert.wilson@clinic.com',
      password: 'SecurePass123!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=robert',
    },
  ];

  // Patient data
  const patients: Register_USER_DTO[] = [
    {
      fname: 'John',
      lname: 'Anderson',
      dob: '1975-04-20',
      gender: 'Male',
      mobile: '+1-555-1001',
      city: 'New York',
      address: '100 Main Street, Apt 5',
      email: 'john.anderson@email.com',
      password: 'PatientPass123!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=johna',
    },
    {
      fname: 'Maria',
      lname: 'Garcia',
      dob: '1982-06-15',
      gender: 'Female',
      mobile: '+1-555-1002',
      city: 'Los Angeles',
      address: '200 Oak Avenue',
      email: 'maria.garcia@email.com',
      password: 'PatientPass123!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
    },
    {
      fname: 'Christopher',
      lname: 'Martinez',
      dob: '1978-11-08',
      gender: 'Male',
      mobile: '+1-555-1003',
      city: 'Chicago',
      address: '300 Pine Road, Suite 12',
      email: 'christopher.martinez@email.com',
      password: 'PatientPass123!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chris',
    },
    {
      fname: 'Lisa',
      lname: 'Thompson',
      dob: '1980-02-14',
      gender: 'Female',
      mobile: '+1-555-1004',
      city: 'Houston',
      address: '400 Elm Street',
      email: 'lisa.thompson@email.com',
      password: 'PatientPass123!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
    },
    {
      fname: 'David',
      lname: 'Lee',
      dob: '1976-08-30',
      gender: 'Male',
      mobile: '+1-555-1005',
      city: 'Phoenix',
      address: '500 Maple Drive',
      email: 'david.lee@email.com',
      password: 'PatientPass123!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    },
  ];

  try {
    console.log('🌱 Starting database seed...\n');

    // Create clinicians
    console.log('👨‍⚕️  Creating clinicians...');
    for (const clinicianData of clinicians) {
      try {
        const clinician = await clinicianService.register(clinicianData);
        console.log(
          `   ✓ Created clinician: ${clinician.fname} ${clinician.lname} (${clinician.email})`,
        );
      } catch (error) {
        console.log(
          `   ⚠ Clinician ${clinicianData.email} already exists (skipped)`,
        );
      }
    }

    console.log('\n👤 Creating patients...');
    // Create patients
    for (const patientData of patients) {
      try {
        const patient = await patientService.register(patientData);
        console.log(
          `   ✓ Created patient: ${patient.fname} ${patient.lname} (${patient.email})`,
        );
      } catch (error) {
        console.log(
          `   ⚠ Patient ${patientData.email} already exists (skipped)`,
        );
      }
    }

    console.log('\n✅ Seed completed successfully!\n');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

seed();
