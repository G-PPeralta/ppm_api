export class AtividadeCampanha {
  id: number;
  naoInciarAntes: Date;
  naoTerminarAntes: Date;
  prioridade: boolean;
  obs: string;

  responsavel_id: number;
  tarefa_id: number;
  area_atuacao_id: number;
}
