import { ApiProperty } from '@nestjs/swagger';
export class Register_USER_DTO {
  @ApiProperty()
  fname: string;
  @ApiProperty()
  lname: string;
  @ApiProperty()
  dob: string;
  @ApiProperty()
  gender: string;
  @ApiProperty()
  mobile: string;
  @ApiProperty()
  city: string;
  @ApiProperty()
  address: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  avatar: string;
}
