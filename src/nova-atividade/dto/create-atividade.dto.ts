export class CreateAtividade {
  nom_usu_create: string;
  id_origem: string;
  nom_atividade: string;
  atividade_id: number;
  responsavel_id: number;
  area_atuacao: number;
  precedentes: Atividades[];
  duracao: number;
  fase_id: number;
}

export class Atividades {
  atividadePrecedenteId: number;
  dias: number;
}
