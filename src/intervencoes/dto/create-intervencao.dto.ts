import { IsNotEmpty } from 'class-validator';
import { SondaExists } from '../../sonda/validators/exists-sondas.validator';
import { IntervencaoTipoExists } from '../../intervencoes-tipo/validators/exists-intervencoes-tipo.validator';
import { PocoExists } from '../../poco/validators/exists-pocos.validator';

export class CreateIntervencaoDto {
  @IsNotEmpty()
  @PocoExists()
  pocoId: number;
  sequencia: string;
  inicioPlanejado: Date;
  observacoes: string;

  @IntervencaoTipoExists()
  tipoProjetoId: number;

  @SondaExists()
  sptId: number;
}
