import { AtividadeIntervencao } from '@prisma/client';
export class AtividadesIntervencaoEntity implements AtividadeIntervencao {
  nome: string;
  id: number;
  obs: string;
  tarefaId: number;
  areaAtuacaoId: number;
  dias: number;
}
