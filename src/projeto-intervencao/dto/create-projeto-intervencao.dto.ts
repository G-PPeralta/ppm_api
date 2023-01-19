import { IsNotEmpty } from 'class-validator';

export class Atividades {
  atividadeId: number;

  ordem: number;
  precedentes: number[];
}

export class CreateProjetoIntervencaoDto {
  nome: string;
  comentarios: string;
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
