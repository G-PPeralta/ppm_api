/**
 *  CRIADO EM: 23/12/2022
 *  AUTOR: Felipe Mateus
 *  DESCRIÇÃO DO ARQUIVO: Interface Filtro
 */
export class FiltroDto {
  pocoId: number;
  sondaId: number;
  profundidadeIni: number;
  profundidadeFim: number;
  metodoElevacao: string;
  metodoElevacaoId: number;
  dataDe: string;
  dataAte: string;
  idOperacao: number;
}
