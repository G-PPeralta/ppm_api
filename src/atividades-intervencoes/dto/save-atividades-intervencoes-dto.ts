import { SaveAtividadesPrecedentesDto } from './save-atividades-precedentes.dto';

export class SaveAtividadesIntervencoeDto {
  prioridade: boolean;
  obs: string;
  responsavelId: number;
  tarefaId: number;
  areaAtuacaoId: number;
  atividadesPrecedentes?: SaveAtividadesPrecedentesDto;
}
