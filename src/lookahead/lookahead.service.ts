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

  async atividade(id: string) {
    return await this.prisma.$queryRawUnsafe(`
      SELECT * FROM tb_projetos_atividade WHERE id = ${+id}
    `);
  }

  async getFerramentaServico(id: string) {
    return await this.prisma.$queryRawUnsafe(
      `
      SELECT 
      id,
      atividade_id,
      nome,
      data_hora,
      anotacoes,
      tipo
      FROM (
        SELECT 
        f.id,
        f.atividade_id,
        f.nome,
        f.data_hora,
        f.anotacoes,
        'f' AS tipo
        
        from tb_atividade_ferramentas f
        WHERE f.atividade_id = ${id}
        
        union
        SELECT 
        s.id,
        s.atividade_id,
        s.nome,
        s.data_hora,
        s.anotacoes,
        's' AS tipo
        from tb_atividade_servicos s
        WHERE s.atividade_id = ${id}
      )
      AS A

      `,
    );
  }
}
