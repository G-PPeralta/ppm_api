export class CreateProjetosFilhoDto {
  nom_usu_create: string;
  id_sonda: number;
  id_poco: number;
  operacao_id: number;
  data_inicio: Date;
  data_fim: Date;
  duracao: string;
  metodo_elevacao_id: number;
  profundidade: number;
  flag: number;
  naoIniciarAntesDe: number;
}
