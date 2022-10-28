interface Acao {
  id: number;
  item: string; //(macroID + '.' + itemID)
  nome: string;
  data_inicio: Date;
  duration: number;
  progress: number;
}

export class CreateGanttDto {
  macroatividade_id: number;
  macroatividade_item: string; //macroId.toString()
  macroatividade_nome_projeto: string;
  micro: Acao[];
}

export interface Gantt {
  nomeProjeto: string;
  macroatividades: CreateGanttDto[];
}

export interface GanttPayload {
  nome_projeto: string;
  data_inicio: Date;
  data_fim: Date;
  microatividade_id: number;
  nome_atividade: string;
  //item: string;
  macroatividade_id: number;
  macroatividade_nome: string;
  //macroatividade_item: number;
  duracao: number;
  progresso: number;
}
