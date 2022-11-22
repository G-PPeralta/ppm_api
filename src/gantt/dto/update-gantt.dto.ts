export class UpdateGanttDto {
  dat_ini_real: Date;
  dat_fim_real: Date;
  dat_ini_plan: string;
  duracao_dias: number;
  // dat_fim_plan: string;
  pct_real: number;
  responsavel_id: number;
  nome_atividade: string;
}
