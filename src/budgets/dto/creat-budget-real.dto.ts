export interface BudgetReal {
  id?: number;
  atividadeId?: number;
  valor: number;
  data: string;
  fornecedor: string;
  classeServico: string;
  pedido: number;
  textPedido: string;
  nom_usu_create?: string;
  nom_usu_edit?: string;
  dat_usu_create: string;
}
