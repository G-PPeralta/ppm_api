import { Tarefa } from '@prisma/client';

export class TarefaEntity implements Tarefa {
  id: number;
  tarefa: string;
}
