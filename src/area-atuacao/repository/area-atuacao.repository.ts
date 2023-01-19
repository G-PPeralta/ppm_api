/**
 * CRIADO EM: 20/11/2022
 * AUTOR: Pedro de França Lopes
 * DESCRIÇÃO DO ARQUIVO: Repositorio com ações relacionadas a area atuação
 */
import { Injectable } from '@nestjs/common';
import { AreaAtuacaoEntity } from '../entities/area-atuacao.entity';
import { PrismaService } from '../../services/prisma/prisma.service';
import { CreateAreaAtuacaoDto } from 'area-atuacao/dto/create-area-atuacao.dto';

@Injectable()
export class AreaAtuacaoRepository {
  constructor(private prisma: PrismaService) {}

  async getOneOrFail(id: number): Promise<AreaAtuacaoEntity> {
    return await this.prisma.areaAtuacao.findFirstOrThrow({ where: { id } });
  }

  async getAll() {
    return await this.prisma.$queryRawUnsafe(`
    SELECT * FROM tb_areas_atuacoes WHERE deletado = false;
    `);
  }

  async save(area: CreateAreaAtuacaoDto) {
    return await this.prisma.areaAtuacao.create({ data: area });
  }

  async saveProjetos(area: CreateAreaAtuacaoDto) {
    return await this.prisma.$queryRawUnsafe(`
      INSERT INTO tb_areas_atuacoes (tipo, area_sistema) values('${area.tipo}', 'P');
    `);
  }
}
