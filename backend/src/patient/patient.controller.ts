import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

import { Register_USER_DTO } from './dtos/register.dtos';
import { Login_USER_DTO } from './dtos/login.dtos';

import { RoleCategories } from 'src/common/enum';
import { Roles } from 'src/guards/roles';
import { PatientService } from './patient.service';
import { Patient } from 'src/models/patients.schema';

@ApiTags('patient')
@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Roles(RoleCategories.ClinicianAndPatient)
  @Get('/')
  async getList() {
    return await this.patientService.getList();
  }

  @Post()
  async register(@Body() body: Register_USER_DTO) {
    return await this.patientService.register(body);
  }

  @Post('/login')
  async loginUser(@Body() body: Login_USER_DTO) {
    return this.patientService.login(body);
  }

  @Roles(RoleCategories.ClinicianAndPatient)
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({ name: 'id', required: false })
  @Get('/detail')
  async getuser(
    @Query() data: { email?: string; id?: string },
  ): Promise<Partial<Patient>> {
    return await this.patientService.getUser(data);
  }
}
