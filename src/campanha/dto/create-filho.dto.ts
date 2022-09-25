export class CreateCampanhaFilhoDto {
  nom_usu_create: string;
  poco_id: number;
  campo_id: number;
  id_campanha: number;
  dat_ini_prev: Date;
  atividades: Atividades[];
  comentarios: string;
}

export class Atividades {
  tarefa_id: number;
  qtde_dias: number;
}
