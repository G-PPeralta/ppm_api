import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateOcorrenciaDto } from './dto/create-ocorrencia.dto';

@Injectable()
export class OcorrenciasService {
  constructor(private prisma: PrismaService) {}

  async create(payload: CreateOcorrenciaDto) {
    await this.prisma.$queryRawUnsafe(`
        INSERT INTO tb_projetos_ocorrencias
        (id_atv, id_projeto, id_sonda, id_poco, id_ocorrencia, dsc_ocorrencia, dat_ocorrencia, num_hrs_impacto, nom_usu_create,
            dat_usu_create, url_anexo)
        VALUES
        (${payload.id_atv}, ${payload.id_projeto}, ${payload.id_sonda}, ${payload.id_poco}, ${payload.id_ocorrencia},
            '${payload.dsc_ocorrencia}', '${payload.dat_ocorrencia}', ${payload.num_hrs_impacto}, '${payload.nom_usu_create}', now(), '${payload.url_anexo}');
    `);
  }

  async update(payload: CreateOcorrenciaDto, id: number) {
    await this.prisma.$queryRawUnsafe(`
    UPDATE b_projetos_ocorrencias
    SET 
    id_atv=${payload.id_atv}, id_projeto=${payload.id_projeto}, id_sonda=${payload.id_sonda}, id_poco=${payload.id_poco}, id_ocorrencia=${payload.id_ocorrencia}, dsc_ocorrencia='${payload.dsc_ocorrencia}', dat_ocorrencia='${payload.dat_ocorrencia}', num_hrs_impacto=${payload.num_hrs_impacto}, nom_usu_alt='${payload.nom_usu_alt}', dat_usu_alt=now()
    WHERE
    id = ${id}
    `);
  }

  async findAll() {
    return await this.prisma.$queryRawUnsafe(`
    SELECT id, id_atv, id_projeto, id_sonda, id_poco, id_ocorrencia, dsc_ocorrencia, dat_ocorrencia, num_hrs_impacto, nom_usu_create, dat_usu_create, nom_usu_alt, dat_usu_alt, nom_usu_exc, dat_usu_exc
    FROM tb_projetos_ocorrencias;
    `);
  }

  async findOne(id: number) {
    return await this.prisma.$queryRawUnsafe(`
    SELECT id, id_atv, id_projeto, id_sonda, id_poco, id_ocorrencia, dsc_ocorrencia, dat_ocorrencia, num_hrs_impacto, nom_usu_create, dat_usu_create, nom_usu_alt, dat_usu_alt, nom_usu_exc, dat_usu_exc
    FROM tb_projetos_ocorrencias
    where id = ${id}
    `);
  }

  async delete(id: number) {
    return await this.prisma.$queryRawUnsafe(`
    DELETE tb_projetos_ocorrencias
    WHERE id = ${id};
    `);
  }
}
