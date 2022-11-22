export class CreateCampanhaProjetoTipo {
  nom_usu_create: string;
  nom_projeto_tipo: string;
  atividades: Atividades[];
  comentarios: string;
  tipo_intervencao_id: number;
  controlar_cronograma: boolean;
}

export class Atividades {
  atividade_id_origem: string;
  area_id: number;
  tarefa_id: number;
  qtde_dias: number;
  precedentes: Precedentes[];
}

export class Precedentes {
  id: number;
  nome: string;
  checked: boolean;
}
