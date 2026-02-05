import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { clinicianProvider } from 'src/providers';
import { Clinician } from '../models/clinicians.schema';
import { getHash, Messages, verifyHash } from 'src/common';
import { Register_USER_DTO } from './dtos/register.dtos';
import { signDataForToken } from 'src/common/helpers';
import { Visit } from 'src/models/visits.schema';
import { Patient } from 'src/models/patients.schema';

@Injectable()
export class ClinicianService {
  constructor(
    @Inject(clinicianProvider.provide)
    private clinicianModel: typeof Clinician,
  ) {}

  async login(data: { email: string; password: string }) {
    if (!data.password.trim() || !data.email.trim()) {
      throw new BadRequestException(Messages.Login_Failed);
    }
    try {
      const clinician = await this.clinicianModel.findOne({
        where: { email: data.email.toLowerCase().trim() },
        attributes: ['id', 'fname', 'lname', 'email', 'password', 'createdAt'],
      });

      if (!clinician) {
        throw new BadRequestException(Messages.Login_Failed);
      }

      const isMatch = await verifyHash(clinician.password, data.password);
      if (!isMatch) {
        throw new BadRequestException(Messages.Login_Failed);
      }

      const tokenPayload = {
        email: clinician.email,
        role: 'clinician',
        fname: clinician.fname,
        lname: clinician.lname,
      };

      const token = signDataForToken(tokenPayload);

      return {
        id: clinician.id,
        fname: clinician.fname,
        lname: clinician.lname,
        email: clinician.email,
        accessToken: token,
        refreshToken: token,
        created_at: clinician.createdAt as Date,
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

    const checkClinician = await this.clinicianModel.findOne({
      where: { email: data.email.toLowerCase().trim() },
    });

    if (checkClinician) {
      throw new BadRequestException('Clinician with this email already exists');
    }

    const clinician = await this.clinicianModel.create(body);
    return {
      id: clinician.id,
      fname: clinician.fname,
      lname: clinician.lname,
      email: clinician.email,
      created_at: clinician.createdAt as Date,
    };
  }

  async getUser(data: {
    email?: string;
    id?: string;
  }): Promise<Partial<Clinician>> {
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

      const clinicianDetails = await this.clinicianModel.findOne({
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
        include: [
          {
            model: Visit,
            include: [Patient],
          },
        ],
      });

      if (!clinicianDetails) {
        throw Error(Messages.Not_Found);
      }

      return { ...clinicianDetails.toJSON() };
    } catch {
      throw new NotFoundException(Messages.User_Not_Found);
    }
  }

  getList() {
    return this.clinicianModel.findAll();
  }
}
