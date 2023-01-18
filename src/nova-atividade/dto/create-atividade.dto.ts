/**
 *  CRIADO EM: 13/01/2023
 *  AUTOR: Felipe Mateus
 *  DESCRIÇÃO DO ARQUIVO: Interfaces Atividade
 */

export class CreateAtividade {
  nom_usu_create: string;
  id_origem: string;
  nom_atividade: string;
  atividade_id: number;
  responsavel_id: number;
  area_atuacao: number;
  fase_id: number;
  nao_iniciar_antes_de: {
    data: Date | null;
    checked: boolean;
  };
  nao_terminar_depois_de: {
    data: Date | null;
    checked: boolean;
  };
  o_mais_breve_possivel: boolean;
  precedentes: Atividades[];
  duracao: number;
}

export class Atividades {
  atividadePrecedenteId: number;
  dias: number;
}
