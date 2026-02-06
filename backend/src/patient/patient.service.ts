import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { patientProvider } from 'src/providers';
import { Clinician } from '../models/clinicians.schema';
import { getHash, Messages, verifyHash } from 'src/common';
import { Register_USER_DTO } from './dtos/register.dtos';
import { signDataForToken } from 'src/common/helpers';
import { Patient } from 'src/models/patients.schema';

@Injectable()
export class PatientService {
  constructor(
    @Inject(patientProvider.provide)
    private patientModel: typeof Patient,
  ) {}

  async login(data: { email: string; password: string }) {
    if (!data.password.trim() || !data.email.trim()) {
      throw new BadRequestException(Messages.Login_Failed);
    }
    try {
      const patient = await this.patientModel.findOne({
        where: { email: data.email.toLowerCase().trim() },
        attributes: ['id', 'fname', 'lname', 'email', 'password', 'createdAt'],
      });

      if (!patient) {
        throw new BadRequestException(Messages.User_Not_Found);
      }

      const isMatch = await verifyHash(patient.password, data.password);
      if (!isMatch) {
        throw new BadRequestException(Messages.Login_Failed);
      }

      const tokenPayload = {
        email: patient.email,
        role: 'patient',
        fname: patient.fname,
        lname: patient.lname,
      };

      const token = signDataForToken(tokenPayload);

      return {
        id: patient.id,
        fname: patient.fname,
        lname: patient.lname,
        email: patient.email,
        accessToken: token,
        refreshToken: token,
        created_at: patient.createdAt as Date,
      };
    } catch (error) {
      throw new BadRequestException(
        (error as Error).message || Messages.Login_Failed,
      );
    }
  }

  async register(data: Register_USER_DTO) {
    const body = { ...data };
    if (data.password) {
      body.password = await getHash(data.password);
    }
    if (data.email) {
      body.email = data.email.toLowerCase();
    }

    const checkPatient = await this.patientModel.findOne({
      where: { email: data.email.toLowerCase().trim() },
    });

    if (checkPatient) {
      throw new BadRequestException('Patient with this email already exists');
    }

    const patient = await this.patientModel.create(body);
    return {
      id: patient.id,
      fname: patient.fname,
      lname: patient.lname,
      email: patient.email,
      created_at: patient.createdAt as Date,
    };
  }

  async getUser(data: {
    email?: string;
    id?: string;
  }): Promise<Partial<Patient>> {
    const query: { email?: string; id?: string } = {};

    if (data.email?.trim()) {
      query.email = data.email.toLowerCase().trim();
    }
    if (data.id) {
      query.id = data.id;
    }
    try {
      if (!Object.keys(query).length) {
        throw new BadRequestException(Messages.Query_Empty);
      }

      const patientDetails = await this.patientModel.findOne({
        where: query,
        attributes: [
          'id',
          'fname',
          'lname',
          'dob',
          'gender',
          'mobile',
          'city',
          'address',
          'email',
          'avatar',
        ],
        include: [Clinician],
      });

      if (!patientDetails) {
        throw Error(Messages.Not_Found);
      }

      return { ...patientDetails.toJSON() };
    } catch {
      throw new NotFoundException(Messages.User_Not_Found);
    }
  }

  getList() {
    return this.patientModel.findAll();
  }
}
