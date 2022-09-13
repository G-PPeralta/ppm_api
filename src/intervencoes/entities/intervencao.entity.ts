import { Intervencao } from '@prisma/client';

export class IntervencaoEntity implements Intervencao {
  fim_planejado: Date;
  id: number;
  sequencia: string;
  inicioPlanejado: Date;
  observacoes: string;
  tipoProjetoId: number;
  sptId: number;
  pocoId: number;
  campoId: number;
}
