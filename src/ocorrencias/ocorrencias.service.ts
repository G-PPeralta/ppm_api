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
        (${id_atv}, '${payload.ocorrencia}', '${payload.observacoes}', ${payload.impacto}, '${payload.user}', now());
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
    SELECT id, dsc_ocorrencia as nome_ocorrencia, observacoes, num_hrs_impacto as impacto
    FROM tb_projetos_ocorrencias
    where id_atv = ${id}
    `);
  }

  async delete(id: number) {
    return await this.prisma.$queryRawUnsafe(`
    DELETE tb_projetos_ocorrencias
    WHERE id = ${id};
    `);
  }
}
