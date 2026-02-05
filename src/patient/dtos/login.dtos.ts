import { ApiProperty } from '@nestjs/swagger';
export class Login_USER_DTO {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}
