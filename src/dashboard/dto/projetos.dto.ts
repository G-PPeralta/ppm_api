export class ProjetoDto {
  id: number;
  nomeProjeto: string;
  descricao?: string;
  justificativa?: string;
  valorTotalPrevisto?: number;
  dataInicio: Date;
  dataFim: Date;
  poloId: number;
  localId: number;
  solicitanteId: number;
  classificacaoId?: number;
  divisaoId: number;
  gateId?: number;
  tipoProjetoId: number;
  // demandaId?: number;
  statusId: number;
  prioridadeId: number;
  complexidadeId: number;
  dataInicioReal?: Date;
  dataFimReal?: Date;
  comentarios?: string;
  deletado: boolean;
  item: number;
  // numero: number;
  responsavel_id?: number;
  coordenador_id?: number;
  elemento_pep: string;
}
