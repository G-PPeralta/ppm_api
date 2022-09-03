import { SaveAtividadesPrecedentesDto } from './save-atividades-precedentes.dto';

export class SaveAtividadesIntervencoeDto {
  nome: string;
  prioridade: boolean;
  obs: string;
  responsavelId: number;
  tarefaId: number;
  areaAtuacaoId: number;
  atividadesPrecedentes?: SaveAtividadesPrecedentesDto;
}
