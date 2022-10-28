export class CreateProjetosAtividadeDto {
  nom_usu_create: string;
  sonda_id: number;
  poco_id: number;
  atividades: Atividades[];
  comentarios: string;
}

export class Atividades {
  area_id: number;
  operacao_id: number;
  responsavel_id: number;
  data_inicio: Date;
  duracao: number;
  precedentes: Precedentes[];
}

export class Precedentes {
  id: number;
  nome: string;
  checked: boolean;
}
