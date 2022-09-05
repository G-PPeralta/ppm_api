import { AtividadeIntervencaoExists } from '../../atividades-intervencoes/validators/exitis-atividades-intervencoes.validator';
import { IsNotEmpty } from 'class-validator';

export class CreateAtividade {
  @AtividadeIntervencaoExists()
  atividaeId: number;
  ordem: number;
}

export class CreateIntervencoesTipoDto {
  @IsNotEmpty()
  nome: string;
  obs: string;
  atividades: CreateAtividade[];
}
