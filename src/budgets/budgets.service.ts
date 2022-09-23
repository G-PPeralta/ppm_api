import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
// import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetsService {
  constructor(private prisma: PrismaService) {}
  create(_createBudgetDto: CreateBudgetDto) {
    return 'This action adds a new budget';
  }

  async findAll() {
    const pais: any[] = await this.prisma.$queryRawUnsafe(`select 
      inner_query.id_pai as id_pai,
      (
      select nom_atividade from dev.tb_camp_atv_campanha
      where id = inner_query.id_pai and id_pai = 0
      ) as nome_pai,
      sum(planejado.vlr_planejado) as soma_planejado_filhos,
      sum(realizado.vlr_realizado) as soma_realizado_filhos,
      ROUND(((sum(realizado.vlr_realizado)/ sum(planejado.vlr_planejado))* 100), 0) as gap
      from dev.tb_projetos_atividade_custo_plan planejado
      inner join dev.tb_projetos_atividade_custo_real realizado
      on (realizado.id_atividade = planejado.id_atividade)
      inner join dev.tb_camp_atv_campanha atividades
      on (atividades.id = planejado.id_atividade)
      inner join (
          select id_pai, id, nom_atividade from dev.tb_camp_atv_campanha
      ) inner_query
      on inner_query.id = atividades.id 
      where atividades.id in (110, 117, 108)
        group by 
        inner_query.id_pai  
    `);

    const result = pais.map(async (pai, Pkey) => {
      const filhos: any[] = await this.prisma
        .$queryRawUnsafe(`select planejado.id as id_planejado,
        realizado.id as id_realizado,
        planejado.id_atividade as id_atividade,
        atividades.nom_atividade as nom_atividade,
        planejado.vlr_planejado,
        realizado.vlr_realizado,
        ROUND(((realizado.vlr_realizado/planejado.vlr_planejado)* 100), 0) as gap,
        planejado.txt_observacao as observacao_planejada,
        realizado.txt_observacao as observacao_realizado
        from dev.tb_projetos_atividade_custo_plan planejado
        inner join dev.tb_projetos_atividade_custo_real realizado
        on (realizado.id_atividade = planejado.id_atividade)
        inner join dev.tb_camp_atv_campanha atividades
        on (atividades.id = planejado.id_atividade)
       
     `); // where atividades.id_pai = ${pai.id_pai}

      return {
        id: pai.id_pai,
        item: `${++Pkey}`,
        projeto: {
          id: pai.id_pai,
          nome: pai.nome_pai,
        },
        planejado: +pai.soma_planejado_filhos,
        realizado: +pai.soma_realizado_filhos,
        gap: +pai.gap,
        descricao: pai.observacao_planejada + pai.dobservacao_realizado,
        filhos: filhos.map((filho, Fkey) => {
          return {
            id: filho.id_filho,
            item: `${Pkey}.${++Fkey}`,
            projeto: {
              id: filho.id_atividade,
              nome: filho.nom_atividade,
            },
            planejado: +filho.vlr_planejado,
            realizado: +filho.vlr_realizado,
            gap: +filho.gap,
            descricao: filho.observacao_planejada + filho.dobservacao_realizado,
          };
        }),
      };
    });

    return await Promise.all(result);
  }

  findOne(id: number) {
    return `This action returns a #${id} budget`;
  }

  async update(id: number, campo: string, valor: string) {
    const existe = await this.prisma.$queryRawUnsafe(`
    select CAST(count(*) AS INT) as qt from tb_camp_atv_campanha where id = ${id} and dat_ini_real is null;
    `);
    if (existe) {
      await this.prisma.$queryRawUnsafe(`
        UPDATE tb_camp_atv_campanha SET ${campo} = ${
        !isNaN(+valor) ? valor : "'" + valor + "'"
      }
      where id = ${id}`);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} budget`;
  }
}