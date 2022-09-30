import { IsNotEmpty } from 'class-validator';

export class CreateAtividadeFerramentaDto {
  @IsNotEmpty()
  nome: string;

  @IsNotEmpty()
  atividade_id: number;

  @IsNotEmpty()
  data_hora: Date;
  anotacoes?: string;
}
