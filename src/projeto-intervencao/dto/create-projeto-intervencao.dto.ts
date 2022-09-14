import { AtividadeIntervencaoExists } from '../../atividades-intervencoes/validators/exitis-atividades-intervencoes.validator';
import { IsNotEmpty } from 'class-validator';

export class Atividades {
  @AtividadeIntervencaoExists()
  atividadeId: number;

  ordem: number;
  precedentes: number[];
}

export class CreateProjetoIntervencaoDto {
  nome: string;
  obs: string;
  atividades: Atividades[];
}

// interface payload = {
//   nomeProjeto: string;
//   comentarios: string;
//   atividades: [{
//     atividade: string;
//     precedentes: number[];
//   }]
// }
