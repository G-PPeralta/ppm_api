import { Campo } from '@prisma/client';

export class CampoEntity implements Campo {
  id: number;
  campo: string;
  poloId: number;
}
