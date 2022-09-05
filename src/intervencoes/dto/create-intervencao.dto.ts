import { IsNotEmpty } from 'class-validator';
import { SondaExists } from '../../sonda/validators/exists-sondas.validator';
import { IntervencaoTipoExists } from '../../intervencoes-tipo/validators/exists-intervencoes-tipo.validator';
import { PocoExists } from '../../poco/validators/exists-pocos.validator';
import { CampoExists } from '../../campos/validators/exists-campos.validator';

export class CreateIntervencaoDto {
  sequencia: string;
  inicioPlanejado: Date;
  observacoes: string;

  @IntervencaoTipoExists()
  tipoProjetoId: number;

  @SondaExists()
  sptId: number;

  @IsNotEmpty()
  @PocoExists()
  pocoId: number;

  @CampoExists()
  campoId: number;
}
