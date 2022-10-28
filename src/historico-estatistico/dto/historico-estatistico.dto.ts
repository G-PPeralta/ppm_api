export class HistoricoEstatisticoDto {
  id_projeto: number;
  id_sonda: number;
  id_poco: number;
  id_operacao: number;
  hrs_totais: number;
  num_profundidade: number;
  dat_conclusao: Date;
  mes: number;
  ano: number;
  mesano: number;
  hrs_npt_man: number;
  hrs_npt_rec_ori: number;
  hrs_npt_rec_cia: number;
  hrs_npt_clima: number;
  hrs_npt_inf_tec: number;
  hrs_npt_outros: number;
  ind_moc: number;
  ind_calcular: 1 | 0;
}
