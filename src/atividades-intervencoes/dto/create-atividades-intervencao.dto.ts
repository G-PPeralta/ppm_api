import { IsNotEmpty } from 'class-validator';

import { AreaAtuacaoExists } from '../../area-atuacao/validators/exists-area-atuacao.validator';
export class CreateAtividadesIntervencoeDto {
  obs: string;

  @IsNotEmpty()
  tarefaId: number;

  @IsNotEmpty()
  @AreaAtuacaoExists()
  areaAtuacaoId: number;
  dias: number;
}
