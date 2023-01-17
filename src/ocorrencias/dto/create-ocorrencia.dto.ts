/**
 *  CRIADO EM: 23/12/2022
 *  AUTOR: Felipe Mateus
 *  DESCRIÇÃO DO ARQUIVO: Interface Ocorrencia
 */

export class CreateOcorrenciaDto {
  user: string;
  ocorrencia: string;
  impacto: number;
  observacoes: string;
  id_poco: number;
  id_sonda: number;
  anexo: string;
}
