export class AtividadeCampanha {
  id: number;
  naoInciarAntes: Date;
  naoTerminarAntes: Date;
  prioridade: boolean;
  obs: string;

  responsavelId: number;
  tarefaId: number;
  areaAtuacaoId: number;
}
