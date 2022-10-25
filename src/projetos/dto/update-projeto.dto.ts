// import { PartialType } from '@nestjs/swagger';
// import { CreateProjetoDto } from './create-projeto.dto';

export class UpdateProjetoDto {
  nome_responsavel?: number;
  coordenador_nome?: number;
  status?: number;
  polo?: number;
  local?: number;
  solicitacao?: number;
  nome_projeto?: string;
  elemento_pep?: string;
  data_inicio?: Date;
  data_fim?: Date;
  data_inicio_real?: Date | null;
  data_fim_real?: Date | null;
  divisao?: number;
  classificacao?: number;
  tipo?: number;
  gate?: number;
  prioridade?: number;
  complexidade?: number;
  descricao?: string;
  justificativa?: string;
}
