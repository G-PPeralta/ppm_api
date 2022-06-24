import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UserWithRole extends PartialType(CreateUserDto) {
  id: number;
  role: string;
  nome_role: string;
}
