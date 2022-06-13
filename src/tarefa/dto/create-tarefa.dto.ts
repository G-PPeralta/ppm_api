class CreateTarefaDto {
  id: number;
  area: string;
  tarefa: string;
  precedentes_diretos: string;
  fase: string;
  duracao_planejada: string;
}

export { CreateTarefaDto };
