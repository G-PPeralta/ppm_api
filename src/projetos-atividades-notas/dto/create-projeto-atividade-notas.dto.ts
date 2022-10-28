export class CreateProjetosAtividadeNotasDto {
  id_atividade: number;
  txt_nota: string;
  nom_usu_create: string;
  ind_tipo_anotacao: 1 | 2;
  url_anexo: string;
  cod_moc: string;
}
