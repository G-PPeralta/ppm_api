import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';

@Injectable()
export class LookaheadService {
  constructor(private prisma: PrismaService) {}

  async projetosComAtividades() {
    return await this.prisma.$queryRawUnsafe(`
      SELECT DISTINCT
      PRJ.item,
      PRJ.id, 
      PRJ.nome_projeto,
      PRJ.descricao,
      PRJ.justificativa   

      FROM tb_projetos PRJ
        JOIN tb_projetos_atividade PRJ_ATV ON PRJ.id = PRJ_ATV.id_projeto;
    `);
  }

  async atividadesPorProjeto(id: string) {
    return await this.prisma.$queryRawUnsafe(`
      SELECT * FROM tb_projetos_atividade WHERE id_projeto = ${+id}
    `);
  }
}
