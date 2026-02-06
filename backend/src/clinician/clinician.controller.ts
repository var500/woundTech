import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { Register_USER_DTO } from './dtos/register.dtos';
import { Login_USER_DTO } from './dtos/login.dtos';
import { ClinicianService } from './clinician.service';
import { Clinician } from 'src/models/clinicians.schema';
import { RoleCategories } from 'src/common/enum';
import { Roles } from 'src/guards/roles';

@ApiTags('clinician')
@Controller('clinician')
export class ClinicianController {
  constructor(private readonly clinicianService: ClinicianService) {}

  @ApiBearerAuth('bearer')
  @Roles(RoleCategories.onlyClinician)
  @Get('/')
  async getList() {
    return await this.clinicianService.getList();
  }

  @Post()
  async register(@Body() body: Register_USER_DTO) {
    return await this.clinicianService.register(body);
  }

  @Post('/login')
  async loginUser(@Body() body: Login_USER_DTO) {
    return this.clinicianService.login(body);
  }

  @ApiBearerAuth('bearer')
  @Roles(RoleCategories.onlyClinician)
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({ name: 'id', required: false })
  @Get('/detail')
  async getuser(
    @Query() data: { email?: string; id?: string },
  ): Promise<Partial<Clinician>> {
    return await this.clinicianService.getUser(data);
  }
}
