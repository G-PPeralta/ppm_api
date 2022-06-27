import { UserWithRole } from 'user/dto/user-with-role.dto';

export class CreateLogDto {
  rota: string;
  requisicao: string;
  usuario: UserWithRole;
}
