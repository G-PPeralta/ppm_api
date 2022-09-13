import { AtividadeIntervencao } from '@prisma/client';
export class AtividadesIntervencaoEntity implements AtividadeIntervencao {
  id: number;
  obs: string;
  tarefaId: number;
  areaAtuacaoId: number;
  dias: number;
}
