import { IsNotEmpty } from 'class-validator';

export class CreateAtividadesIntervencoeDto {
  obs: string;

  @IsNotEmpty()
  tarefaId: number;

  @IsNotEmpty()
  areaAtuacaoId: number;
  dias: number;
}
