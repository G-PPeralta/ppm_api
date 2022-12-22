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
        JOIN tb_projetos_atividade PRJ_ATV ON PRJ.id = PRJ_ATV.id_projeto
      WHERE PRJ.tipo_projeto_id = 3;
    `);
  }

  async atividadesFilho(id: string) {
    return await this.prisma.$queryRawUnsafe(`
    select
    filho.nom_atividade,
    filho.dat_ini_real as data_atividade
    
    from dev.tb_projetos_atividade pai
    join dev.tb_projetos_atividade filho on pai.id = filho.id_pai    
    
    where pai.id = ${id}
    and filho.dat_ini_real is not null
    order by filho.dat_ini_real
    `);
  }

  async atividadesPorProjeto(id: string) {
    if (id == '0') {
      return await this.prisma.$queryRawUnsafe(`
      SELECT distinct a.* from tb_projetos_atividade a  
      inner join tb_pocos c
        on a.nom_atividade = c.nom_poco 
    where 
         id_operacao is null
    and id_pai <> 0
    `);
    } else {
      return await this.prisma.$queryRawUnsafe(`
      SELECT * from tb_projetos_atividade a  
      inner join tb_pocos c
        on a.nom_atividade = c.nom_poco 
    where 
         id_operacao is null
    and id_pai <> 0
      WHERE a.id_projeto = ${+id}
    `);
    }
  }

  async atividade(id: string) {
    return await this.prisma.$queryRawUnsafe(`
    SELECT a.* 
    FROM tb_projetos_atividade a
    inner join tb_pocos c
      on a.nom_atividade = c.nom_poco 
    where 
        a.id_operacao is null
    AND a.id_pai <> 0
    and a.id = ${+id}
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
