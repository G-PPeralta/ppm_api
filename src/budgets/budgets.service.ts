import { Injectable } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { PrismaService } from 'services/prisma/prisma.service';
import { BudgetReal } from './dto/creat-budget-real.dto';
import { BudgetPlan } from './dto/create-budget-plan.dto';
import { CreateBudgetDto } from './dto/create-budget.dto';
// import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetsService {
  constructor(private prisma: PrismaService) {}
  async updateBudgetPlan(_updateBudgetDto: BudgetPlan) {
    const where = {
      id_atividade: _updateBudgetDto.atividadeId,
    };
    const update = {
      vlr_planejado: _updateBudgetDto.valor,
    };

    const create = {
      ...update,
      ...where,
    };

    return await this.prisma.atividadeCustoPlanejado.upsert({
      where,
      update,
      create,
    });
  }

  async createBudgetReal(_updateBudgetReal: BudgetReal) {
    const budgetReal = {
      id_fornecedor: _updateBudgetReal.fornecedor,
      dat_lcto: _updateBudgetReal.data,
      vlr_realizado: _updateBudgetReal.valor,
      txt_observacao: _updateBudgetReal.textPedido,
      num_pedido: _updateBudgetReal.pedido,
      nom_usu_create: _updateBudgetReal.nom_usu_create,
      atividade: {
        connect: {
          id: _updateBudgetReal.atividadeId,
        },
      },
    };
    return this.prisma.atividadeCustosRealizado.create({
      data: budgetReal,
    });
  }

  async findAll() {
    const pais: any[] = await this.prisma.$queryRawUnsafe(` 
    select
    sonda.id as id_pai,
    sonda.nom_atividade as nome_pai,
    sonda.id as id_campanha,
    max(coalesce(planejado.vlr_planejado, 0)) as soma_planejado_filhos,
    coalesce(sum(realizado.vlr_realizado), 0) as soma_realizado_filhos,
    round(
    case when max(coalesce(planejado.vlr_planejado, 0)) = 0 then 0
    when coalesce(sum(realizado.vlr_realizado), 0) = 0 then 0
    else (coalesce(sum(realizado.vlr_realizado), 0)/max(coalesce(planejado.vlr_planejado, 0))) * 100 end, 0)as gap
    from tb_projetos_atividade sonda
    inner join tb_projetos_atividade poco
    on poco.id_pai = sonda.id
    left join tb_projetos_atividade atividades
    on atividades.id_pai = poco.id
    left join tb_projetos_atividade_custo_plan planejado
    on planejado.id_atividade = atividades.id
    left join tb_projetos_atividade_custo_real realizado
    on realizado.id_atividade = atividades.id
    where 
    sonda.id_pai = 0
    group by
    sonda.id,
    sonda.nom_atividade  
    `);

    const result = pais.map(async (pai, Pkey) => {
      const filhos: any[] = await this.prisma.$queryRawUnsafe(`select 
      planejado.id as id_planejado,
      realizado.id as id_realizado,
      planejado.id_atividade as id_atividade,
      case when atividades.nom_atividade is null then operacao.nom_operacao else atividades.nom_atividade end as nom_atividade,
      planejado.vlr_planejado,
      realizado.vlr_realizado,
      ROUND(((realizado.vlr_realizado/planejado.vlr_planejado)* 100), 0) as gap,
      planejado.txt_observacao as observacao_planejada,
      realizado.txt_observacao as observacao_realizado
      from
      tb_projetos_atividade_custo_plan planejado
      inner join tb_projetos_atividade_custo_real realizado
      on (realizado.id_atividade = planejado.id_atividade)
      inner join tb_projetos_atividade atividades
      on (atividades.id = planejado.id_atividade)
      left join tb_projetos_operacao operacao
      on (operacao.id = atividades.id_operacao)
      inner join tb_projetos_atividade poco
      on poco.id = atividades.id_pai
      inner join tb_projetos_atividade sonda
      on sonda.id_pai = 0 and sonda.id = poco.id_pai
      where
      sonda.id = ${pai.id_pai}
      group by 
      planejado.id,
      realizado.id,
      planejado.id_atividade,
      case when atividades.nom_atividade is null then operacao.nom_operacao else atividades.nom_atividade end
        
     `);

      return {
        id: pai.id_pai,
        item: `${++Pkey}`,
        projeto: {
          id: pai.id_campanha,
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

  async findAllDetail() {
    const pais: any[] = await this.prisma.$queryRawUnsafe(`select 
    atividades.id_pai as id_pai,
    campanha.nom_campanha as nome_pai,
    pai.id_campanha as id_campanha,
    sum(planejado.vlr_planejado) as soma_planejado_filhos,
    sum(realizado.vlr_realizado) as soma_realizado_filhos,
    ROUND(((sum(realizado.vlr_realizado)/ sum(planejado.vlr_planejado))* 100), 0) as gap

    from dev.tb_projetos_atividade_custo_plan planejado

    inner join dev.tb_projetos_atividade_custo_real realizado
    on (realizado.id_atividade = planejado.id_atividade)

    inner join dev.tb_camp_atv_campanha atividades
    on (atividades.id = planejado.id_atividade)
    inner join dev.tb_camp_atv_campanha pai
    on (pai.id_pai = 0 and pai.id = atividades.id_pai)
    inner join dev.tb_campanha campanha
    on (campanha.id = pai.id_campanha)
    group by
    pai.id_campanha,
    campanha.nom_campanha,
    atividades.id_pai
    `);

    const result = pais.map(async (pai, Pkey) => {
      const filhos: any[] = await this.prisma
        .$queryRawUnsafe(`select planejado.id as id_planejado,
        realizado.id as id_realizado,
        planejado.id_atividade as id_atividade,
        tarefas.nom_atividade  as nom_atividade,
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
        inner join dev.tb_camp_atv tarefas
        on (tarefas.id = atividades.tarefa_id)
        where atividades.id_pai = ${pai.id_pai}
     `);

      return {
        id: pai.id_pai,
        brt: `${++Pkey}`,
        projeto: {
          id: pai.id_campanha,
          nome: pai.nome_pai,
        },
        planejado: +pai.soma_planejado_filhos,
        realizado: +pai.soma_realizado_filhos,
        gap: +pai.gap,
        descricao: pai.observacao_planejada + pai.dobservacao_realizado,
        filhos: filhos.map((filho, Fkey) => {
          return {
            id: filho.id_filho,
            brt: `${Pkey}.${++Fkey}`,
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

  async findAllProjects() {
    const projetos = await this.prisma.tb_projetos_atividade.findMany({
      select: { nom_atividade: true, id: true },
      where: { id_pai: 0 },
    });

    return projetos.map((data) => {
      return { nome: data.nom_atividade, id: data.id };
    });
  }
}
