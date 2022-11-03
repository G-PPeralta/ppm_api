export interface CustoDiarioDto {
  startDate: string;
  endDate: string;
}

export interface CustoDiarioORMDto {
  id: string;
  fornecedor: string;
  nome_atividade: string;
  num_pedido: string;
  txt_observacao: string;
  valor_realizado: number;
  data_realizado: string;
}
