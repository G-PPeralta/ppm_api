export class QueryTotalProjetosDto {
  'id': number;
  'status': string;
  'qtd': number;
  'total': number;
  'prioridades_alta': number;
  'prioridades_media': number;
  'prioridades_baixa': number;
  'prioridades_nula': number;
}

export class ProjetosPorStatusDto {
  id: number;
  status: string;
  qtd: number;
}

export class PrioridadesProjetoDto {
  alta: number;
  media: number;
  baixa: number;
  nula: number;
}

export class TotalProjetosDto {
  projetosPorStatus: ProjetosPorStatusDto[];
  totalProjetos: number;
  prioridades: PrioridadesProjetoDto;
}
