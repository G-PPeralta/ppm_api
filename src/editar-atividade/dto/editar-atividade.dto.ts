export class EditarAtividadeDto {
  nom_usu_create: string;
  geral: {
    id_atividade: number;
    nome_atividade: string;
    pct_real: number;
    inicio_realizado: Date;
    fim_realizado: Date;
    inicio_planejado: Date;
    fim_planejado: Date;
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
}
