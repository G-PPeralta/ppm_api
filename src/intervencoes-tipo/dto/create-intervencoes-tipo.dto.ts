export class CreateAtividade {
  atividaeId: number;
  ordem: number;
}

export class CreateIntervencoesTipoDto {
  nome: string;
  obs: string;
  atividades: CreateAtividade[];
}
