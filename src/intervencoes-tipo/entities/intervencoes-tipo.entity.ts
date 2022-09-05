import { IntervencaoTipo } from '@prisma/client';

export class IntervencoesTipoEntity implements IntervencaoTipo {
  id: number;
  nome: string;
  obs: string;
}
