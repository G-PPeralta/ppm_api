/**
 *  CRIADO EM: 16/11/2022
 *  AUTOR: Felipe Mateus
 *  DESCRIÇÃO DO ARQUIVO: Interface de  estatisticas
 */

export class CreateEstatisticaDto {
  id_sonda: number;
  id_poco: number;
  nom_usu_create: string;
  id_atividade: number;
  id_area: number;
  id_responsavel: number;
  inicio_realizado: Date;
  inicio_planejado: Date;
  duracao_realizado: number; //horas
  duracao_planejado: number; //horas
}
