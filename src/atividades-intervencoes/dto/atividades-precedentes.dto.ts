import { AtividadeIntervencaoExists } from '../validators/exitis-atividades-intervencoes.validator';
import { IsNotEmpty } from 'class-validator';

export class AtividadesPretendentes {
  @IsNotEmpty()
  @AtividadeIntervencaoExists()
  atividaeId: number;

  @IsNotEmpty()
  ordem: number;
}
