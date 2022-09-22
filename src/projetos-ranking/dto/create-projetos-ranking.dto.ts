export class CreateProjetosRankingDto {
  id_projeto: number;
  beneficio: {
    opcao_id: number;
    id_ranking: number;
  };
  regulatorio: {
    opcao_id: number;
    id_ranking: number;
  };
  operacao: {
    opcao_id: number;
    id_ranking: number;
  };
  prioridade: {
    opcao_id: number;
    id_ranking: number;
  };
  complexidade: {
    opcao_id: number;
    id_ranking: number;
  };
  estrategia: {
    opcao_id: number;
    id_ranking: number;
  };
  dsc_comentario: string | null;
  nom_usu_create: string;
}
