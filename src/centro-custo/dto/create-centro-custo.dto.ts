export class CreateCentroCustoDto {
  valor: number;
  data: Date;
  prestadorServicoId: number;
  classeDeServicoId: number;
  pedido: string;
  descricaoDoServico: string;
  user: string;
  bm: string;
  id_nf: string;
  valor_bm_nf: number;
  status: 0 | 1;
  data_pagamento: Date;
  valor_pago: number;
}
