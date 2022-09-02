import { ResponsavelExists } from '../../responsavel/validators/existis-responsavel.validators';
import { IsNotEmpty } from 'class-validator';
import { AtividadesPretendentes } from './atividades-precedentes.dto';
import { TarefaExists } from '../../tarefa/validators/existis-tarefa.validator';
// import { AreaAtuacaoExists } from 'atividades-intervencoes/validators/exists-area-atuacao.validator';

export class CreateAtividadesIntervencoeDto {
  prioridade: boolean;
  obs: string;

  @IsNotEmpty()
  @ResponsavelExists()
  responsavelId: number;

  @IsNotEmpty()
  @TarefaExists()
  tarefaId: number;

  @IsNotEmpty()
  // @AreaAtuacaoExists()
  areaAtuacaoId: number;

  atividadesPrecedentes: AtividadesPretendentes[];
}
