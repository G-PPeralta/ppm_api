import { IntervencaoProjetoTipo } from '@prisma/client';

export class ProjetoIntervencaoEntity implements IntervencaoProjetoTipo {
  id: number;
  nome: string;
  obs: string;
}
