export class CreateNovaOperacao {
  nom_usu_create: string;
  id_origem: string;
  nom_operacao: string;
  responsavel_id: number;
  area_id: number;
  nao_iniciar_antes_de: {
    data: Date;
    checked: boolean;
  };
  nao_terminar_depois_de: {
    data: Date;
    checked: boolean;
  };
  o_mais_breve_possivel: boolean;
}
