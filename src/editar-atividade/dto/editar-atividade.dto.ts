export class EditarAtividadeDto {
  nom_usu_create: string;
  id_poco_pai: string;
  geral: {
    id_atividade: number;
    nome_atividade: string;
    pct_real: number;
    inicio_realizado: Date;
    fim_realizado: Date;
    inicio_planejado: Date;
    fim_planejado: Date;
    flag: number;
    hrs_totais: number;
    hrs_reais: number;
    realEditado: number;
  };
  anotacoes: {
    anotacoes: string;
  };
  mocs: [
    {
      numero_moc: string;
      anexo: string;
    },
  ];
  aprs: [
    {
      codigo_apr: string;
      anexo: string;
    },
  ];
}
