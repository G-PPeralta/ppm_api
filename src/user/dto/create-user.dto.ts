import { Perfil } from '@prisma/client';

export class CreateUserDto {
  nome: string;
  telefone: string;
  email: string;
  area_atuacao: string;
  senha: string;
  perfil: Perfil;
}
