import { Sonda } from '@prisma/client';

export class SondaEntity implements Sonda {
  id: number;
  nome: string;
}
