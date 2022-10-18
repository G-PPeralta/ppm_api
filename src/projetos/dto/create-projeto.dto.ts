export class CreateProjetoDto {
  nomeProjeto: string;
  descricao?: string;
  justificativa?: string;
  capexPrevisto?: string;
  dataInicio: Date;
  dataFim: Date;
  poloId: number;
  localId: number;
  solicitanteId: number;
  classificacaoId?: number;
  divisaoId: number;
  gateId?: number;
  tipoProjetoId: number;
  statusId: number;
  prioridadeId: number;
  complexidadeId: number;
  dataInicioReal?: Date;
  dataFimReal?: Date;
  comentarios?: string;
  deletado: boolean;
  item: number;
  responsavelId?: number;
  coordenadorId?: number;
  elementoPep: string;
  nom_usu_create: string;
}
