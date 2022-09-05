import { Intervencao } from '@prisma/client';

export class IntervencaoEntity implements Intervencao {
  id: number;
  pocoId: number;
  camp: string;
  sequencia: string;
  inicioPlanejado: Date;
  observacoes: string;
  tipoProjetoId: number;
  sptId: number;
}
