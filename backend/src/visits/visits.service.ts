import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Op } from 'sequelize';
import { Messages } from 'src/common';
import { VisitStatus } from 'src/common/enum';
import { Clinician } from 'src/models/clinicians.schema';
import { Patient } from 'src/models/patients.schema';

import { Visit } from 'src/models/visits.schema';
import {
  clinicianProvider,
  patientProvider,
  visitProvider,
} from 'src/providers';
import { ScheduleVisitDTO } from './dtos/schedule-visit.dto';

@Injectable()
export class VisitsService {
  constructor(
    @Inject(patientProvider.provide)
    private patientModel: typeof Patient,
    @Inject(clinicianProvider.provide)
    private clinicianModel: typeof Clinician,
    @Inject(visitProvider.provide)
    private visitsModel: typeof Visit,
  ) {}

  async getVisits(userId: string) {
    if (!userId) {
      throw new BadRequestException(Messages.User_id_missing);
    }

    try {
      const patient = await this.patientModel.findByPk(userId);

      if (patient) {
        return this.visitsModel.findAll({
          where: { patient_id: userId },
          attributes: [
            'id',
            'notes',
            'createdAt',
            'updatedAt',
            'scheduled_at',
            'status',
            'check_in_at',
            'check_out_at',
          ],
          include: [
            {
              model: Clinician,
              attributes: ['id', 'fname', 'lname', 'email', 'mobile', 'avatar'],
            },
          ],
          order: [['createdAt', 'DESC']],
        });
      }

      const clinician = await this.clinicianModel.findByPk(userId);

      if (clinician) {
        return this.visitsModel.findAll({
          where: { clinician_id: userId },
          attributes: [
            'id',
            'notes',
            'createdAt',
            'updatedAt',
            'scheduled_at',
            'status',
            'check_in_at',
            'check_out_at',
          ],
          include: [
            {
              model: Patient,
              attributes: [
                'id',
                'fname',
                'lname',
                'dob',
                'email',
                'avatar',
                'mobile',
              ],
            },
          ],
          order: [['createdAt', 'DESC']],
        });
      }

      throw new BadRequestException(Messages.User_Not_Found);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      throw new BadRequestException(
        (error as Error).message || Messages.Visit_fetch_failed,
      );
    }
  }

  async register(body: ScheduleVisitDTO) {
    const { patient_id, clinician_id, scheduled_at, notes } = body;

    const patient = await this.patientModel.findByPk(patient_id);
    if (!patient) throw new BadRequestException('Patient not found');

    const clinician = await this.clinicianModel.findByPk(clinician_id);
    if (!clinician) throw new BadRequestException('Clinician not found');

    const visitDate = new Date(Number(scheduled_at));
    const visitDurationMs = 30 * 60 * 1000;

    /*
     * Case 1 :  Clinician can only see a patient once per day
     */

    const startOfDay = new Date(visitDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(visitDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingVisitSameDay = await this.visitsModel.findOne({
      where: {
        clinician_id,
        patient_id,
        scheduled_at: {
          [Op.between]: [startOfDay, endOfDay],
        },
        status: { [Op.ne]: VisitStatus.CANCELLED },
      },
    });

    if (existingVisitSameDay) {
      throw new BadRequestException(Messages.Visit_already_exists);
    }

    /*
     * Case  2: Patient cannot have overlapping visits (30 min buffer)
     */

    const newVisitStart = visitDate.getTime();
    const newVisitEnd = newVisitStart + visitDurationMs;

    const overlappingVisit = await this.visitsModel.findOne({
      where: {
        patient_id,
        status: { [Op.ne]: VisitStatus.CANCELLED },
        [Op.and]: [
          {
            scheduled_at: {
              [Op.lt]: new Date(newVisitEnd),
            },
          },
          {
            scheduled_at: {
              [Op.gt]: new Date(newVisitStart - visitDurationMs),
            },
          },
        ],
      },
    });

    if (overlappingVisit) {
      throw new BadRequestException(Messages.Visit_overlapping);
    }

    return this.visitsModel.create({
      patient_id,
      clinician_id,
      scheduled_at: visitDate,
      status: VisitStatus.SCHEDULED,
      notes,
    });
  }

  async checkIn(visitId: string) {
    const visit = await this.visitsModel.findByPk(visitId);
    if (!visit) throw new NotFoundException(Messages.Visits_Not_Found);

    if (visit.status !== VisitStatus.SCHEDULED) {
      throw new BadRequestException(
        'Visit is not in a valid state to check in',
      );
    }

    return visit.update({
      check_in_at: new Date(),
      status: VisitStatus.IN_PROGRESS,
    });
  }

  async checkOut(visitId: string) {
    const visit = await this.visitsModel.findByPk(visitId);
    if (!visit) throw new NotFoundException(Messages.Visits_Not_Found);

    if (visit.status !== VisitStatus.IN_PROGRESS) {
      throw new BadRequestException(Messages.Visit_Not_In_Progress);
    }

    return visit.update({
      check_out_at: new Date(),
      status: VisitStatus.COMPLETED,
    });
  }
}
