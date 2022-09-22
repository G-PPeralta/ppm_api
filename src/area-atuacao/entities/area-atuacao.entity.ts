import { AreaAtuacao } from '@prisma/client';

export class AreaAtuacaoEntity implements AreaAtuacao {
  id: number;
  tipo: string;
  deletado: boolean;
}
