import { Polo } from '@prisma/client';

export class PoloEntity implements Polo {
  id: number;
  polo: string;
  deletado: boolean;
}
