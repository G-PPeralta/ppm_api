export interface CustoDiarioDto {
  startDate: string;
  endDate: string;
}

export interface CustoDiarioORMDto {
  id: string;
  nome_atividade: string;
  valor_realizado: number;
  data_realizado: Date;
}
