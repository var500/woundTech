import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { RoleCategories } from 'src/common/enum';
import { Roles } from 'src/guards/roles';
import { VisitsService } from './visits.service';
import { ScheduleVisitDTO } from './dtos/schedule-visit.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Visits')
@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @ApiBearerAuth('bearer')
  @Roles(RoleCategories.ClinicianAndPatient)
  @Get()
  async getVisits(
    @Query('userId') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return await this.visitsService.getVisits(
      userId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  @ApiBearerAuth('bearer')
  @Roles(RoleCategories.ClinicianAndPatient)
  @Post()
  async register(@Body() body: ScheduleVisitDTO) {
    return await this.visitsService.register(body);
  }

  @ApiBearerAuth('bearer')
  @Roles(RoleCategories.ClinicianAndPatient)
  @Post('check-in')
  async checkIn(@Body() body: { visit_id: string }) {
    return await this.visitsService.checkIn(body.visit_id);
  }

  @ApiBearerAuth('bearer')
  @Roles(RoleCategories.ClinicianAndPatient)
  @Post('check-out')
  async checkOut(@Body() body: { visit_id: string }) {
    return await this.visitsService.checkOut(body.visit_id);
  }
}
