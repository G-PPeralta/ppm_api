import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateOcorrenciaDto } from './dto/create-ocorrencia.dto';

@Injectable()
export class OcorrenciasService {
  constructor(private prisma: PrismaService) {}

  async create(payload: CreateOcorrenciaDto, id_atv: number) {
    await this.prisma.$queryRawUnsafe(`
        INSERT INTO tb_projetos_ocorrencias
        (id_atv, dsc_ocorrencia, observacoes, num_hrs_impacto, nom_usu_create,
            dat_usu_create)
        VALUES
        (${id_atv}, '${payload.ocorrencia}', '${payload.observacoes}', ${payload.impacto}, '${payload.user}', now())
        ON CONFLICT (id_atv, dsc_ocorrencia) DO
        UPDATE
        SET
        observacoes = '${payload.observacoes}',
        num_hrs_impacto = ${payload.impacto}
        WHERE
        id_atv = ${id_atv} AND
        dsc_ocorrencia = '${payload.ocorrencia}'
    `);
  }

  async findAll() {
    return await this.prisma.$queryRawUnsafe(`
    SELECT id, dsc_ocorrencia as nome_ocorrencia, observacoes, num_hrs_impacto as impacto
    FROM tb_projetos_ocorrencias;
    `);
  }

  async findOne(id: number) {
    return await this.prisma.$queryRawUnsafe(`
    SELECT 
      case when b.id is null then 0 else b.id end as id, 
      case when b.dsc_ocorrencia is null then a.dsc_ocorrencia else b.dsc_ocorrencia end as nome_ocorrencia, 
      case when b.num_hrs_impacto is null then 0 else b.num_hrs_impacto end as impacto
    from tb_ocorrencias a
    left join tb_projetos_ocorrencias b
		on a.id = b.id_ocorrencia
    where b.id_atv = ${id} or b.id_atv is null
    `);
  }

  async delete(id: number) {
    return await this.prisma.$queryRawUnsafe(`
    DELETE tb_projetos_ocorrencias
    WHERE id = ${id};
    `);
  }
}
