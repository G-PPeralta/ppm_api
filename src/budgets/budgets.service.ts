import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { firstValueFrom, map } from 'rxjs';
import { PrismaService } from 'services/prisma/prisma.service';
import { BudgetReal } from './dto/creat-budget-real.dto';
import { BudgetPlan } from './dto/create-budget-plan.dto';
import { CreateBudgetDto } from './dto/create-budget.dto';
// import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetsService {
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}
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
      id_fornecedor: +_updateBudgetReal.fornecedor,
      dat_lcto: new Date(_updateBudgetReal.data).toISOString(),
      vlr_realizado: _updateBudgetReal.valor,
      txt_observacao: _updateBudgetReal.textPedido,
      num_pedido: _updateBudgetReal.pedido,
      nom_usu_create: _updateBudgetReal.nom_usu_create,
      id_atividade: +_updateBudgetReal.atividadeId,
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
    inner join tb_projetos projetos
    on projetos.id = sonda.id_projeto
    left join tb_projetos_atividade atividades
    on atividades.id_pai = poco.id
    left join tb_projetos_atividade_custo_plan planejado
    on planejado.id_atividade = atividades.id
    left join tb_projetos_atividade_custo_real realizado
    on realizado.id_atividade = atividades.id
    where 
    sonda.id_pai = 0 and projetos.tipo_projeto_id = 3
    group by
    sonda.id,
    sonda.nom_atividade  
    `);

    const result = pais.map(async (pai, Pkey) => {
      const filhos: any[] = await this.prisma.$queryRawUnsafe(`
      select 
      poco.id as id_filho, 
      poco.nom_atividade as nome_poco,
      sum(coalesce(planejado.vlr_planejado, 0)) as vlr_planejado,
      sum(coalesce(realizado.vlr_realizado, 0)) as vlr_realizado,
      case when sum(coalesce(realizado.vlr_realizado, 0)) = 0 or sum(coalesce(planejado.vlr_planejado, 0)) = 0 then 0 else
      coalesce(ROUND(((sum(coalesce(realizado.vlr_realizado, 0))/sum(coalesce(planejado.vlr_planejado, 0)))* 100), 0), 0) end as gap,
      coalesce(planejado.txt_observacao, '') as observacao_planejada,
      coalesce(realizado.txt_observacao, '') as observacao_realizado
      from tb_projetos_atividade sonda
      inner join tb_projetos_atividade poco
      on poco.id_pai = sonda.id
      left join tb_projetos_atividade atividades
      on (atividades.id_pai = poco.id)
      left join
      tb_projetos_atividade_custo_plan planejado
      on planejado.id_atividade = atividades.id 
      left join tb_projetos_atividade_custo_real realizado
      on (realizado.id_atividade = planejado.id_atividade)
      left join tb_projetos_operacao operacao
      on (operacao.id = atividades.id_operacao)
      where
      sonda.id = ${pai.id_pai} and sonda.id_pai = 0
      group by poco.id, poco.nom_atividade, coalesce(planejado.txt_observacao, ''), coalesce(realizado.txt_observacao, '')
        
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
              nome: filho.nome_poco,
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

  async findAllDetail(id: number) {
    const pais: any[] = await this.prisma.$queryRawUnsafe(`
    select 
      poco.id as id_pai, 
      poco.nom_atividade as nome_poco,
      coalesce(sum(planejado.vlr_planejado), 0) as vlr_planejado,
      coalesce(sum(realizado.vlr_realizado), 0) as vlr_realizado,
      case when sum(coalesce(realizado.vlr_realizado, 0)) = 0 or sum(coalesce(planejado.vlr_planejado, 0)) = 0 then 0 else
      coalesce(ROUND(((sum(coalesce(realizado.vlr_realizado, 0))/sum(coalesce(planejado.vlr_planejado, 0)))* 100), 0), 0) end as gap
      from tb_projetos_atividade sonda
      inner join tb_projetos_atividade poco
      on poco.id_pai = sonda.id
      left join tb_projetos_atividade atividades
      on (atividades.id_pai = poco.id)
      left join
      tb_projetos_atividade_custo_plan planejado
      on planejado.id_atividade = atividades.id 
      left join tb_projetos_atividade_custo_real realizado
      on (realizado.id_atividade = planejado.id_atividade)
      left join tb_projetos_operacao operacao
      on (operacao.id = atividades.id_operacao)
      where
      poco.id = ${id} and sonda.id_pai = 0
      group by poco.id, poco.nom_atividade`);

    const retornar = async () => {
      const tratamento: any = [];
      let pKey = 0;
      for (const e of pais) {
        let fKey = 0;
        const filhos: any[] = await this.prisma.$queryRawUnsafe(`select 
        poco.id as id_filho, 
        planejado.id as id_planejado,
        atividades.id as id_atividade,
        case when atividades.nom_atividade is null then operacao.nom_operacao else atividades.nom_atividade end as nom_atividade,
        coalesce(sum(planejado.vlr_planejado), 0) as vlr_planejado,
        coalesce(sum(realizado.vlr_realizado), 0) as vlr_realizado,
        coalesce(ROUND(((sum(realizado.vlr_realizado)/sum(planejado.vlr_planejado))* 100), 0), 0) as gap
        from tb_projetos_atividade sonda
        inner join tb_projetos_atividade poco
        on poco.id_pai = sonda.id
        left join tb_projetos_atividade atividades
        on (atividades.id_pai = poco.id)
        left join
        tb_projetos_atividade_custo_plan planejado
        on planejado.id_atividade = atividades.id 
        left join tb_projetos_atividade_custo_real realizado
        on (realizado.id_atividade = planejado.id_atividade)
        left join tb_projetos_operacao operacao
        on (operacao.id = atividades.id_operacao)
        where
        poco.id = ${e.id_pai} and sonda.id_pai = 0
        group by poco.id, planejado.id,
        atividades.id,
        case when atividades.nom_atividade is null then operacao.nom_operacao else atividades.nom_atividade end
     `);

        const dados = {
          id: e.id_pai,
          brt: `${++pKey}`,
          projeto: {
            id: e.id_pai,
            nome: e.nome_pai,
          },
          planejado: +e.vlr_planejado,
          realizado: +e.vlr_realizado,
          gap: +e.gap,
          descricao: e.observacao_planejada + e.observacao_realizado,
          filhos: [],
        };

        filhos.forEach((f) => {
          dados.filhos.push({
            brt: `${pKey}.${++fKey}`,
            projeto: {
              id: f.id_atividade,
              nome: f.nom_atividade,
            },
            id: f.id_filho,
            planejado: +f.vlr_planejado,
            realizado: +f.vlr_realizado,
            gap: +f.gap,
            descricao: f.observacao_planejada + f.dobservacao_realizado,
          });
        });

        let existe = false;
        tratamento.forEach((inner) => {
          if (inner.id === e.id_pai) {
            existe = true;
          }
        });

        if (!existe) {
          tratamento.push(dados);
        }
      }
      return tratamento;
    };

    const titulo = await this.getSondaNome(id);
    const totalizacao = await this.getTotalizacao(id);
    const list = await retornar();

    return { totalizacao, list, titulo };
  }

  async findAllProjects() {
    return this.prisma.$queryRawUnsafe(`select
    sonda.id as id,
    sonda.nom_atividade as nome
    from tb_projetos_atividade sonda
    inner join tb_projetos_atividade poco
    on poco.id_pai = sonda.id
    inner join tb_projetos projetos
    on projetos.id = sonda.id_projeto
    left join tb_projetos_atividade atividades
    on atividades.id_pai = poco.id
    left join tb_projetos_atividade_custo_plan planejado
    on planejado.id_atividade = atividades.id
    left join tb_projetos_atividade_custo_real realizado
    on realizado.id_atividade = atividades.id
    where 
    sonda.id_pai = 0 and projetos.tipo_projeto_id = 3
    group by
    sonda.id,
    sonda.nom_atividade
    order by nome `);
    /*const projetos = await this.prisma.tb_projetos_atividade.findMany({
      select: { nom_atividade: true, id: true },
      where: { id_pai: 0 },
    });

    return projetos.map((data) => {
      return { nome: data.nom_atividade, id: data.id };
    });*/
  }

  async getSondaNome(id) {
    const query = await this.prisma.$queryRawUnsafe(
      `select
      poco.nom_atividade as poco_nome,
      sonda.nom_atividade as sonda_nome
    from tb_projetos_atividade poco 
    inner join tb_projetos_atividade sonda on sonda.id = poco.id_pai
    where
    poco.id =  ${id}
    `,
    );

    return query[0];
  }

  async getInicioAndFim(id) {
    const datas: { inicio: string; fim: string }[] = await this.prisma
      .$queryRawUnsafe(`
      select
      min(dat_ini_plan) as inicio,
        max(dat_fim_plan) as fim
      from tb_projetos_atividade 
      where
      id_pai = ${id}
    `);
    return datas[0];
  }

  async getTotalDiarioAcumulado(id) {
    const custoTotalAcumulado: { total_realizado: number }[] = await this.prisma
      .$queryRawUnsafe(`select 
    sum(realizado .vlr_realizado) as total_realizado  
  from tb_projetos_atividade_custo_real realizado
  inner join tb_projetos_atividade atividade on atividade.id = realizado .id_atividade 
  where 
  atividade.id_pai  = ${id}
  Group by dat_ini_plan, id_projeto
  having  
  atividade.dat_ini_plan  between  min(atividade.dat_ini_plan) and now()`);

    return +custoTotalAcumulado[0]?.total_realizado;
  }

  async getTotalPlanejado(id) {
    const custoPlanejado: { total_planjeado: number }[] = await this.prisma
      .$queryRawUnsafe(`select 
    sum(planejado.vlr_planejado) as total_planjeado  
  from tb_projetos_atividade_custo_plan planejado
  inner join tb_projetos_atividade atividade on atividade.id = planejado .id_atividade 
  where 
  atividade.id_pai  = ${id}
  Group by dat_ini_plan, id_projeto
  having  
  atividade.dat_ini_plan  between  min(atividade.dat_ini_plan) and now()`);

    return +custoPlanejado[0]?.total_planjeado;
  }

  async getTotalRealizdo(id) {
    const custoRealizado: { total_realizado: number }[] = await this.prisma
      .$queryRawUnsafe(`select 
    sum(realizado.vlr_realizado) as total_realizado  
  from tb_projetos_atividade_custo_real realizado
  inner join tb_projetos_atividade atividade on atividade.id = realizado .id_atividade 
  where 
  atividade.id_pai  = ${id} `);
    return +custoRealizado[0]?.total_realizado;
  }

  async convertBRLtoUSD(valueReal: number): Promise<number> {
    const data = await firstValueFrom(
      this.httpService
        .get(`http://economia.awesomeapi.com.br/json/last/USD-BRL`)
        .pipe(
          map((response) => {
            return response.data;
          }),
        ),
    );
    return +valueReal / +data['USDBRL']['bid'];
  }
  async getTotalizacao(id) {
    const custoDiarioTotalBRL = await this.getTotalDiarioAcumulado(id);
    const custoTotalRealizadoBRL = await this.getTotalRealizdo(id);
    const custoTotalTotalPrevistoBRL = await this.getTotalPlanejado(id);

    const custoDiarioTotalUSD = await this.convertBRLtoUSD(custoDiarioTotalBRL);
    const custoTotalRealizadoUSD = await this.convertBRLtoUSD(
      custoTotalRealizadoBRL,
    );
    const custoTotalTotalPrevistoUSD = await this.convertBRLtoUSD(
      custoTotalTotalPrevistoBRL,
    );

    const totalBRL =
      (custoDiarioTotalBRL || 0) +
      (custoTotalRealizadoBRL || 0) +
      (custoTotalTotalPrevistoBRL || 0);
    const totalUSD =
      (custoDiarioTotalUSD || 0) +
      (custoTotalRealizadoUSD || 0) +
      (custoTotalTotalPrevistoUSD || 0);

    return {
      ...(await this.getInicioAndFim(id)),
      custoDiarioTotalBRL,
      custoDiarioTotalUSD,
      custoTotalRealizadoBRL,
      custoTotalRealizadoUSD,
      custoTotalTotalPrevistoBRL,
      custoTotalTotalPrevistoUSD,
      totalBRL,
      totalUSD,
    };
  }
}
