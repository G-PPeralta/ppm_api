import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import { PrismaService } from 'services/prisma/prisma.service';
import { BudgetReal } from './dto/creat-budget-real.dto';
import { BudgetPlan } from './dto/create-budget-plan.dto';
import { CustoDiarioDto, CustoDiarioORMDto } from './dto/custos-diarios.dto';
// import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetsService {
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}
  async updateBudgetPlan(_updateBudgetDto: BudgetPlan) {
    await this.prisma.$queryRawUnsafe(`
    INSERT INTO tb_afe_projeto_plan (id_servico, id_projeto, vlr_planejado, dat_usu_create) 
    VALUES (${_updateBudgetDto.atividadeId}, ${_updateBudgetDto.projetoId}, ${_updateBudgetDto.valor}, now())
    ON CONFLICT (id_servico, id_projeto) DO UPDATE 
      SET vlr_planejado =  ${_updateBudgetDto.valor}, 
          dat_usu_edit = now();
    `);

    // CONTIGENCIA
    await this.prisma.$queryRawUnsafe(`
    INSERT INTO tb_afe_projeto_plan (id_servico, id_projeto, vlr_planejado, dat_usu_create) 
    VALUES (88, ${_updateBudgetDto.projetoId}, ${
      _updateBudgetDto.valor * 0.05
    }, now())
    ON CONFLICT (id_servico, id_projeto) DO UPDATE 
      SET vlr_planejado = (select vlr_planejado from tb_afe_projeto_plan where id_projeto = ${
        _updateBudgetDto.projetoId
      } and id_servico = 88) + ${_updateBudgetDto.valor * 0.05} , 
          dat_usu_edit = now();
    `);

    return _updateBudgetDto;
  }

  async createBudgetReal(createBudgetReal: BudgetReal) {
    const budgetReal = {
      id_fornecedor: +createBudgetReal.fornecedor,
      id_projeto: +createBudgetReal.projetoId,
      dat_lcto: new Date(createBudgetReal.data).toISOString(),
      vlr_realizado: createBudgetReal.valor,
      txt_observacao: createBudgetReal.textPedido,
      num_pedido: createBudgetReal.pedido,
      nom_usu_create: createBudgetReal.nom_usu_create,
      id_atividade: +createBudgetReal.atividadeId,
      classe_servico: createBudgetReal.classeServico,
    };

    return await this.prisma.$queryRawUnsafe(`
    INSERT INTO hmg.tb_afe_projeto_real
    (
      id_servico, 
      id_fornecedor, 
      id_projeto, 
      dat_lcto,
      vlr_realizado, 
      txt_observacao, 
      nom_usu_create,
      dat_usu_create,
      num_pedido, 
      classe_servico
    )
    values (
      ${budgetReal.id_atividade},
      ${budgetReal.id_fornecedor},
      ${budgetReal.id_projeto},
      '${budgetReal.dat_lcto}',
      ${budgetReal.vlr_realizado},
      '${budgetReal.txt_observacao}',
      '${budgetReal.nom_usu_create}',
      now(),
      ${budgetReal.num_pedido},
      '${budgetReal.classe_servico}'
    );
    `);
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
      left join tb_afe_projeto_plan planejado
        on poco.id = planejado.id_projeto
      left join tb_afe_projeto_real realizado
        on poco.id = realizado.id_projeto
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
          (coalesce(
          (
            select sum(vlr_planejado)
            from tb_afe_projeto_plan aa 
            where 
                id_projeto = poco.id
          ), 0)) as vlr_planejado,
          sum(coalesce(realizado.vlr_realizado, 0)) as vlr_realizado,
          0 as gap
          from tb_projetos_atividade sonda
          inner join tb_projetos_atividade poco
            on poco.id_pai = sonda.id
          left join tb_projetos_atividade atividades
            on (atividades.id_pai = poco.id)
          left join tb_afe_projeto_real realizado
            on poco.id = realizado.id_projeto
          left join tb_projetos_operacao operacao
            on (operacao.id = atividades.id_operacao)
          where
          sonda.id = ${pai.id_pai} and sonda.id_pai = 0
          group by poco.id,  poco.nom_atividade
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
    id_pai,
    nome_poco,
    vlr_planejado,
    vlr_realizado,
    case when vlr_planejado = 0 then 0 else round(((vlr_realizado / vlr_planejado) * 100),1) end as gap
  from (
      select 
        a.id as id_pai,
        a.nom_categoria as nome_poco,
        coalesce ((
            select sum(vlr_planejado) 
            from tb_afe_projeto_plan aa 
            inner join tb_afe_itens bb
              on aa.id_servico = bb.id
            where 
                  id_projeto = ${id}
            and 	bb.id_categoria = a.id
        ), 0) as vlr_planejado,
        coalesce ((
            select sum(vlr_realizado) 
            from tb_afe_projeto_real aa 
            inner join tb_afe_itens bb
              on aa.id_servico = bb.id
            where 
                  id_projeto = ${id}
            and 	bb.id_categoria = a.id
        ), 0) as vlr_realizado,
        0 as gap
      from tb_afe_categoria a
  ) as q
  `);

    const retornar = async () => {
      const tratamento: any = [];
      let pKey = 0;
      for (const e of pais) {
        // const fKey = 0;
        const filhos: any[] = await this.prisma.$queryRawUnsafe(`
        select 
            a.id_categoria as id_filho,
            (select id from tb_afe_projeto_plan where id_servico = a.id and id_projeto = ${id}) as id_planejado,
            a.id as id_atividade,
            a.nom_servico as nom_atividade,
            coalesce((select vlr_planejado from tb_afe_projeto_plan where id_servico = a.id and id_projeto = ${id}), 0) as vlr_planejado,
            coalesce((select vlr_realizado from tb_afe_projeto_real where id_servico = a.id and id_projeto = ${id}), 0) as vlr_realizado,
            0 gap
        from tb_afe_itens a
        where a.id_categoria = ${e.id_pai}
     `);

        const dados = {
          id: e.id_pai,
          brt: `${++pKey}`,
          projeto: {
            id: e.id_pai,
            nome: e.nome_poco,
          },
          planejado: +e.vlr_planejado,
          realizado: +e.vlr_realizado,
          gap: +e.gap,
          descricao: e.observacao_planejada + e.observacao_realizado,
          filhos: [],
        };

        filhos.forEach((f) => {
          dados.filhos.push({
            brt: f.id_atividade,
            projeto: {
              id_projeto: id,
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
      .$queryRawUnsafe(`
        select sum(vlr_realizado) as total_realizado
        from tb_afe_projeto_real aa 
        inner join tb_afe_itens bb
          on aa.id_servico = bb.id
        where 
            id_projeto = ${id}
        --and dat_lcto between (select min(dat_lcto) from tb_afe_projeto_real where id_projeto = ${id} and now())
      `);

    return +custoTotalAcumulado[0]?.total_realizado;
  }

  async getTotalPlanejado(id) {
    const custoPlanejado: { total_planjeado: number }[] = await this.prisma
      .$queryRawUnsafe(`

      select sum(vlr_planejado) as total_planjeado
		  from tb_afe_projeto_plan aa 
		  inner join tb_afe_itens bb
		   	on aa.id_servico = bb.id
		  where 
			  	id_projeto = ${id}
      
      `);

    return +custoPlanejado[0]?.total_planjeado;
  }

  async getTotalRealizdo(id) {
    const custoRealizado: { total_realizado: number }[] = await this.prisma
      .$queryRawUnsafe(`
          select sum(vlr_realizado) as total_realizado
          from tb_afe_projeto_real aa 
          inner join tb_afe_itens bb
            on aa.id_servico = bb.id
          where 
              id_projeto = ${id}
      `);
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

  async custosDiariosFilhoList(id: string, _custoDiario: CustoDiarioDto) {
    let data: CustoDiarioORMDto[] = [];
    if (
      _custoDiario.startDate !== null &&
      _custoDiario.endDate !== null &&
      _custoDiario.startDate !== '' &&
      _custoDiario.endDate !== ''
    ) {
      data = await this.prisma.$queryRawUnsafe(`
        select 
          a.id,
          concat( date_part('year', a.dat_lcto),'-',date_part('month', a.dat_lcto), '-',  date_part('day', a.dat_lcto)) as data_realizado,
          b.nom_servico,
          a.num_pedido,
          a.txt_observacao,
          c.nomefornecedor as fornecedor,
          a.vlr_realizado as valor_realizado
        from tb_afe_projeto_real a 
        inner join tb_afe_itens b 
          on a.id_servico = b.id
        inner join tb_fornecedores c 
          on a.id_fornecedor = c.id
        where 
              id_projeto = 51
        and 	b.id_categoria = ${id} and  a.dat_lcto >= '${_custoDiario.startDate}'
          and a.dat_lcto <= '${_custoDiario.endDate}'`);
    } else {
      data = await this.prisma.$queryRawUnsafe(`
        select 
          a.id,
          concat( date_part('year', a.dat_lcto),'-',date_part('month', a.dat_lcto), '-',  date_part('day', a.dat_lcto)) as data_realizado,
          b.nom_servico,
          a.num_pedido,
          a.txt_observacao,
          c.nomefornecedor as fornecedor,
          a.vlr_realizado as valor_realizado
        from tb_afe_projeto_real a 
        inner join tb_afe_itens b 
          on a.id_servico = b.id
        inner join tb_fornecedores c 
          on a.id_fornecedor = c.id
        where 
              id_projeto = 51
        and 	b.id_categoria = ${id} `);
    }

    const retorno = data.map((custo) => {
      return {
        id: custo.id,
        atividade: custo.nome_atividade,
        date: new Date(custo.data_realizado),
        pedido: custo.num_pedido,
        txt_pedido: custo.txt_observacao,
        fornecedor: custo.fornecedor,
        realizado: +custo.valor_realizado,
      };
    });
    return await Promise.all(retorno);
  }

  async custosDiariosPaiList(id: string, _custoDiario: CustoDiarioDto) {
    let data: CustoDiarioORMDto[] = [];

    if (
      _custoDiario.startDate !== null &&
      _custoDiario.endDate !== null &&
      _custoDiario.startDate !== '' &&
      _custoDiario.endDate !== ''
    ) {
      data = await this.prisma.$queryRawUnsafe(`
        select 
            a.id,
            concat( date_part('year', a.dat_lcto),'-',date_part('month', a.dat_lcto), '-',  date_part('day', a.dat_lcto)) as data_realizado,
            b.nom_servico,
            a.num_pedido,
            a.txt_observacao,
            c.nomefornecedor as fornecedor,
            a.vlr_realizado as valor_realizado
          from tb_afe_projeto_real a 
          inner join tb_afe_itens b 
            on a.id_servico = b.id
          inner join tb_fornecedores c 
            on a.id_fornecedor = c.id
          where 
                id_projeto = 51
          and 	b.id_categoria = ${id}  and  realizado.dat_lcto >= '${_custoDiario.startDate}'
          and realizado.dat_lcto <= '${_custoDiario.endDate}'`);
    } else {
      data = await this.prisma.$queryRawUnsafe(`
        select 
          a.id,
          concat( date_part('year', a.dat_lcto),'-',date_part('month', a.dat_lcto), '-',  date_part('day', a.dat_lcto)) as data_realizado,
          b.nom_servico,
          a.num_pedido,
          a.txt_observacao,
          c.nomefornecedor as fornecedor,
          a.vlr_realizado as valor_realizado
        from tb_afe_projeto_real a 
        inner join tb_afe_itens b 
          on a.id_servico = b.id
        inner join tb_fornecedores c 
          on a.id_fornecedor = c.id
        where 
              id_projeto = 51
        and 	b.id_categoria = ${id} `);
    }

    const retorno = data.map((custo) => {
      return {
        id: custo.id,
        atividade: custo.nome_atividade,
        date: new Date(custo.data_realizado),
        pedido: custo.num_pedido,
        txt_pedido: custo.txt_observacao,
        fornecedor: custo.fornecedor,
        realizado: +custo.valor_realizado,
      };
    });
    return await Promise.all(retorno);
  }

  async getCustoDiario(id) {
    const data = await this.prisma.$queryRawUnsafe(`
      SELECT * FROM tb_projetos_atividade_custo_real
      WHERE id = ${id}
    `);

    return data[0];
  }

  async updateBudgetReal(_updateBudgetReal: BudgetReal) {
    const data = {
      vlr_realizado: _updateBudgetReal.valor,
      dat_lcto: new Date(_updateBudgetReal.data).toISOString(),
      id_fornecedor: +_updateBudgetReal.fornecedor,
      classe_servico: _updateBudgetReal.classeServico,
      num_pedido: _updateBudgetReal.pedido,
      txt_observacao: _updateBudgetReal.textPedido,
      nom_usu_edit: _updateBudgetReal.nom_usu_edit,
    };

    return await this.prisma.$queryRawUnsafe(`
      UPDATE tb_projetos_atividade_custo_real
      SET
      classe_servico = '${data.classe_servico}',
      vlr_realizado = ${data.vlr_realizado},
      dat_lcto = '${data.dat_lcto}',
      id_fornecedor = ${data.id_fornecedor},
      num_pedido = ${data.num_pedido},
      txt_observacao = '${data.txt_observacao}',
      nom_usu_edit = '${data.nom_usu_edit}',
      dat_usu_edit = now()
      WHERE id = ${_updateBudgetReal.id}
    `);
  }

  async deleteCusto(id: number) {
    return this.prisma.$queryRawUnsafe(`
      DELETE FROM tb_projetos_atividade_custo_real WHERE id = ${id}
    `);
  }
}
