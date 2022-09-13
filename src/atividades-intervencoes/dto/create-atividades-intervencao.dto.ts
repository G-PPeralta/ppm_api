// import { ResponsavelExists } from '../../responsavel/validators/existis-responsavel.validators';
import { IsNotEmpty } from 'class-validator';
// import { AtividadesPretendentes } from './atividades-precedentes.dto';
import { TarefaExists } from '../../tarefa/validators/existis-tarefa.validator';
import { AreaAtuacaoExists } from '../../area-atuacao/validators/exists-area-atuacao.validator';

export class CreateAtividadesIntervencoeDto {
  obs: string;

  @IsNotEmpty()
  @TarefaExists()
  tarefaId: number;

  @IsNotEmpty()
  @AreaAtuacaoExists()
  areaAtuacaoId: number;
  dias: number;
}
