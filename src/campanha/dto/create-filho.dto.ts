export class CreateCampanhaFilhoDto {
  nom_usu_create: string;
  poco_id: string;
  nova_campanha: boolean;
  data_limite: Date;
  id_campanha: number;
  dat_ini_prev: Date;
  atividades: Atividades[];
  comentarios: string;
}

export class Atividades {
  tarefa_id: number;
  qtde_dias: number;
  responsavel_id: number;
  area_id: number;
  ind_atv_execucao: boolean;
  precedentes: Precedentes[];
}

export class Precedentes {
  id: number;
  nome: string;
  checked: boolean;
}
