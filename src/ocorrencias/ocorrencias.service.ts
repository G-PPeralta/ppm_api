import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateOcorrenciaDto } from './dto/create-ocorrencia.dto';

@Injectable()
export class OcorrenciasService {
  constructor(private prisma: PrismaService) {}

  async create(payload: CreateOcorrenciaDto, id_atv: number) {
    const projeto = await this.prisma.$queryRawUnsafe(`
      select id_projeto from tb_projetos_atividade where id = ${payload.id_sonda}
    `);

    const ocorrencia = await this.prisma.$queryRawUnsafe(`
      select id from tb_ocorrencias
      where dsc_ocorrencia = '${payload.ocorrencia}'
    `);

    await this.prisma.$queryRawUnsafe(`
        INSERT INTO tb_projetos_ocorrencias
        (id_atv, dsc_ocorrencia, observacoes, num_hrs_impacto, nom_usu_create,
            dat_usu_create, id_sonda, id_poco, id_projeto, id_ocorrencia, url_anexo)
        VALUES
        (${id_atv}, '${payload.ocorrencia}', '', ${payload.impacto}, '${payload.user}', now(), ${payload.id_sonda}, ${payload.id_poco}, ${projeto[0].id_projeto}, ${ocorrencia[0].id}, '${payload.anexo}')
        ON CONFLICT (id_atv, dsc_ocorrencia) DO
        UPDATE
        SET
        num_hrs_impacto = ${payload.impacto}
        WHERE
        tb_projetos_ocorrencias.id_atv = ${id_atv} AND
        tb_projetos_ocorrencias.dsc_ocorrencia = '${payload.ocorrencia}'
    `);

    await this.prisma.$queryRawUnsafe(`call sp_in_historico_graf(${id_atv});`);
  }

  async findAll() {
    return await this.prisma.$queryRawUnsafe(`
    SELECT id, dsc_ocorrencia as nome_ocorrencia, observacoes, num_hrs_impacto as impacto, url_anexo as anexo
    FROM tb_projetos_ocorrencias;
    `);
  }

  async findOne(id: number) {
    return await this.prisma.$queryRawUnsafe(`
    select 
      (select id from tb_projetos_ocorrencias where id_ocorrencia = a.id and id_atv = ${id}) as id,
      dsc_ocorrencia,
      coalesce((select num_hrs_impacto  from tb_projetos_ocorrencias where id_ocorrencia = a.id and id_atv = ${id}),0) as impacto,
      (select url_anexo from tb_projetos_ocorrencias where id_ocorrencia = a.id and id_atv = ${id}) as anexo
    from tb_ocorrencias a
    `);
  }

  async delete(id: number) {
    return await this.prisma.$queryRawUnsafe(`
    UPDATE tb_projetos_ocorrencias set dat_usu_erase = now()
    WHERE id = ${id};
    `);
  }
}
