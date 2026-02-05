import { ApiProperty } from '@nestjs/swagger';
export class ScheduleVisitDTO {
  @ApiProperty()
  patient_id: string;
  @ApiProperty()
  clinician_id: string;
  @ApiProperty()
  scheduled_at: string;
}
