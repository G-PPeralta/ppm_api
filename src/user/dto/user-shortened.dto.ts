import { Perfil } from '@prisma/client';

export class UserShortenedDto {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  area_atuacao: string;
  perfil: Perfil;
}
