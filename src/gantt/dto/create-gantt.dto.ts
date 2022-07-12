interface Substasks {
  id: number;
  item: string; //(macroID + '.' + itemID)
  data_inicio: Date;
  data_fim: Date;
  duration: number;
  progress: number;
}

export class CreateGanttDto {
  macro: number;
  item: string;
  dataInicio: Date;
  subtasks: Substasks[];
}
