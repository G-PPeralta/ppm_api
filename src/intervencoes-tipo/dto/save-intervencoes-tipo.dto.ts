import { SaveAtividadesDto } from './save-atividades.dto';

export class SaveIntervencaoTipoDto {
  nome: string;
  obs: string;
  atividadesRelacao?: SaveAtividadesDto;
}
