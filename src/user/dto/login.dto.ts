import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    type: 'string',
  })
  @IsString()
  email: string;
  @ApiProperty({
    type: 'string',
  })
  @IsString()
  senha: string;
}
