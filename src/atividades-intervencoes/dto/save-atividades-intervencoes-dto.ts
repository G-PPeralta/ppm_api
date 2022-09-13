import { SaveAtividadesPrecedentesDto } from './save-atividades-precedentes.dto';

export class SaveAtividadesIntervencoeDto {
  obs: string;
  tarefaId: number;
  areaAtuacaoId: number;
  atividadesPrecedentes?: SaveAtividadesPrecedentesDto;
}
