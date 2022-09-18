import { Injectable, Logger } from '@nestjs/common';
import { CreateIntervencaoDto } from 'intervencoes/dto/create-intervencao.dto';
import { PrismaService } from '../../services/prisma/prisma.service';
import { SaveIntervencaoDto } from '../dto/save-intervencao.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class IntervencaoRepository {
  constructor(private prisma: PrismaService) {}

  /*async getOneOrFail(id: number): Promise<IntervencaoEntity> {
    return await this.prisma.intervencao.findFirstOrThrow({
      where: { id },
    });
  }*/

  async save(intervencao: SaveIntervencaoDto) {
    const interv = await this.prisma.intervencao.create({
      data: {
        ...intervencao,
        inicioPlanejado: new Date(intervencao.inicioPlanejado),
        fimPlanejado: new Date(intervencao.fimPlanejado),
      },
    });

    return interv;
  }

  async saveResponsabilidade(
    intervencao: SaveIntervencaoDto,
    createIntervencoeDto: CreateIntervencaoDto,
  ) {
    const interv = await this.save(intervencao);

    if (interv) {
      createIntervencoeDto.atividades.forEach(async (element) => {
        await this.prisma.atividadeIntervencaoRelacao.create({
          data: {
            ordem: element.ordem,
            atividadeId: element.atividadeId,
            intervencaoId: interv.id,
            responsavelId: element.responsavel,
            inicioPlanejado: interv.inicioPlanejado,
            fimPlanejado: interv.fimPlanejado,
          },
        });
      });
    }
  }

  async intervencoesList() {
    const intervencao = await this.prisma.intervencao.findMany({
      select: {
        id: true,
        nome: true,
        inicioPlanejado: true,
        fimPlanejado: true,
        observacoes: true,
        tipoProjeto: true,
        poco: true,
        spt: true,
        tb_intervencoes_atividades_relacao: {
          select: {
            atividadeId: true,
            responsavelId: true,
          },
        },
      },
    });
    return intervencao;
  }

  async findOneByAtividade(id: number) {
    return await this.prisma.intervencao.findFirst({
      where: {
        id: id,
      },
    });
  }

  async findByAtividade(id: number) {
    return await this.prisma.intervencao.findMany({
      where: {
        pocoId: id,
      },
    });
  }
}
