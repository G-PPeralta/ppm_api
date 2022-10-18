import { IsNotEmpty } from 'class-validator';

export class CreateAtividadeFerramentaDto {
  @IsNotEmpty()
  nome: string;

  @IsNotEmpty()
  atividade_id: number;

  @IsNotEmpty()
  data: string;

  hora: string;

  anotacoes?: string;
}
