import { IsNotEmpty } from 'class-validator';
import { SondaExists } from '../../sonda/validators/exists-sondas.validator';
import { PocoExists } from '../../poco/validators/exists-pocos.validator';

export class CreateIntervencaoDto {
  inicioPlanejado: Date;
  fimPlanejado: Date;
  observacoes: string;

  tipoProjetoId: number;

  @SondaExists()
  sptId: number;

  @IsNotEmpty()
  @PocoExists()
  pocoId: number;
}
