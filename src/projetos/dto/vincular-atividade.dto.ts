export class VincularAtividade {
  nom_usu_create: string;
  id_projeto: number;
  id_origem: string;
  nom_atividade: string;
  responsavel_id: number;
  relacao_id: number;
  dat_inicio_plan: string;
  duracao_plan: number;
  area_atuacao: string;
  nao_iniciar_antes_de: {
    data: Date;
    checked: boolean;
  };
  nao_terminar_depois_de: {
    data: Date;
    checked: boolean;
  };
  o_mais_breve_possivel: false;
  precedentes: [
    {
      atividadePrecedenteId: number;
      dias: number;
    },
  ];
  macro_id: number;
}
