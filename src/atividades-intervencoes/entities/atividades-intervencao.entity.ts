import { AtividadeIntervencao } from '@prisma/client';
export class AtividadesIntervencaoEntity implements AtividadeIntervencao {
  nome: string;
  id: number;
  prioridade: boolean;
  obs: string;
  responsavelId: number;
  tarefaId: number;
  areaAtuacaoId: number;
}
