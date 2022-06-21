import { IsNotEmpty, Min } from 'class-validator';

export class CreateUserDto {
  nome: string;
  telefone: string;
  email: string;
  area_atuacao: string;
  senha: string;
  @Min(1)
  @IsNotEmpty()
  role_id: number;
}
