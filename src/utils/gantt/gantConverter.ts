import { Gantt, GanttPayload } from 'gantt/dto/create-gantt.dto';

export function ganttFormatter(dataGantt: GanttPayload[]): Gantt {
  const nomeProjeto = dataGantt[0].nome_projeto;

  const macroAtividade = dataGantt
    .filter((dado) => !!dado.macroatividade_id)
    .map(({ macroatividade_id, macroatividade_nome, macroatividade_item }) => ({
      macroatividade_id,
      macroatividade_nome,
      macroatividade_item,
    }));

  let macroAtividadeFormatada = macroAtividade.reduce((unique, o) => {
    if (!unique.some((obj) => obj.macroatividade_id === o.macroatividade_id)) {
      unique.push(o);
    }
    return unique;
  }, []);

  macroAtividadeFormatada = macroAtividadeFormatada.map((macro) => ({
    ...macro,
    micro: dataGantt.filter(
      (dado) => dado.macroatividade_id === macro.macroatividade_id,
    ),
  }));

  const atividadesSemMacro = dataGantt
    .filter((dado) => !dado.macroatividade_id)
    .map((gantt) =>
      Object.assign(gantt, {
        macroatividade_id: gantt.microatividade_id,
        macroatividade_nome: gantt.nome_atividade,
        macroatividade_item: gantt.item,
      }),
    );

  macroAtividadeFormatada.push(...atividadesSemMacro);

  return { nomeProjeto: nomeProjeto, macroatividades: macroAtividadeFormatada };
}
