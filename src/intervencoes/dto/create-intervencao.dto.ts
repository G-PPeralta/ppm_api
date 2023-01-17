/**
 *  CRIADO EM: 17/11/2022
 *  AUTOR: Felipe Mateus
 *  DESCRIÇÃO DO ARQUIVO: Interface intervenção
 */
import { IsNotEmpty } from 'class-validator';
import { SondaExists } from '../../sonda/validators/exists-sondas.validator';
import { AtividadeIntervencaoExists } from 'atividades-intervencoes/validators/exitis-atividades-intervencoes.validator';

export class Atividades {
  @AtividadeIntervencaoExists()
  atividadeId: number;

  ordem: number;
  responsavel: number;
}

export class CreateIntervencaoDto {
  inicioPlanejado: Date;
  fimPlanejado: Date;
  observacoes: string;
  nome: string;

  atividades: Atividades[];
  tipoProjetoId: number;

  campoId: number;

  @SondaExists()
  sptId: number;

  @IsNotEmpty()
  pocoId: number;
}
