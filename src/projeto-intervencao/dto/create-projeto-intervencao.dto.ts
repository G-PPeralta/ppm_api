import { AtividadesPrecedentes } from 'atividades-intervencoes/dto/atividades-precedentes.dto';

class Atividades {
  atividade: string;
  precedentes: AtividadesPrecedentes[];
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
