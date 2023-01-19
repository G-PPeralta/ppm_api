import { IsNotEmpty } from 'class-validator';
import { SondaExists } from '../../sonda/validators/exists-sondas.validator';
import { PocoExists } from '../../poco/validators/exists-pocos.validator';

export class Atividades {
  atividadeId: number;

  ordem: number;
  responsavel: number;
}

export class CreateIntervencaoDto {
  inicioPlanejado: Date;
  fimPlanejado: Date;
  observacoes: string;
  nome: string;

  atividades: Atividades[];
  tipoProjetoId: number;

  campoId: number;

  @SondaExists()
  sptId: number;

  @IsNotEmpty()
  @PocoExists()
  pocoId: number;
}
