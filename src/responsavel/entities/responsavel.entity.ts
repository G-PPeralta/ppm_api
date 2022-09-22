import { Responsavel } from '@prisma/client';

export class ResponsavelEntity implements Responsavel {
  id: number;
  nome: string;
}
