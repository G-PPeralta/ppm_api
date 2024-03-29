/**
 * CRIADO EM: 07/07/2022
 * AUTOR: GABRIEL PERALTA
 * DESCRIÇÃO: Serviço que cria, lista, atualiza e remove um projeto.
 */

import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { addWorkDays } from 'utils/days/daysUtil';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';
import { VincularAtividade } from './dto/vincular-atividade.dto';

@Injectable()
export class ProjetosService {
  constructor(private prismaClient: PrismaService) {}

  async filtroProjetos(nomProjeto: string) {
    //select que preenche a tabela da tela de projetos. Leva em consideração o ranking, para ordenar de acordo.
    const query = `
    select 
          a.id,
          a.nome_projeto,
          vlr_cr,
          vlr_orcado,
          prioridade,
          complexidade_id,
          complexidade,
          polo_id,
          polo,
          coordenador,
          coordenador_id,
          coalesce(a.data_inicio, b.data_inicio) as data_inicio,
          coalesce(a.data_fim, b.data_fim) as data_fim,
          pct,
          coalesce(a.descricao, b.descricao) as descricao,
          coalesce(a.justificativa, b.justificativa) as justificativa,
          a.id as id_projeto_real,
          case when vlr_cpi is null then
            1
          else vlr_cpi end  as vlr_cpi,
          case when vlr_spi is null then
            1
          else vlr_spi end  as vlr_spi,
          case when ranking is null then 0 else ranking end as vlr_ranking
      from tb_projetos a
      left join (select aa.id_projeto, sum(bb.num_nota) as ranking
                  from tb_projetos_ranking aa
                  inner join tb_ranking_opcoes bb
                  on aa.id_ranking = bb.id_ranking 
                  and aa.id_opcao = bb.id
                  group by aa.id_projeto
      ) as qr4
        on a.id = qr4.id_projeto
      left join (
        select 
            id AS id_projeto,
            trunc(case when coalesce(vlr_cr, 0) = 0 then 0 else vlr_va / vlr_cr end, 2) as vlr_cpi,
            trunc(case when coalesce(vlr_vp, 0) = 0 then 0 else vlr_va / vlr_vp end, 2) as vlr_spi,
            vlr_cr,
            valor_total_previsto AS vlr_orcado,
            prioridade,
            complexidade,
            polo,
            coordenador_nome AS coordenador,
            nome_responsavel AS responsavel,
            data_inicio,
            data_fim,
            0 AS pct,
            descricao,
            justificativa,
            nome_projeto
            from (
            select 
              id,
              (fn_cron_calc_pct_plan_projeto(0, id)/100) * sum(vlr_planejado) as vlr_vp, 
              (fn_cron_calc_pct_real_projeto(0, id)/100) * sum(vlr_planejado) as vlr_va,
              sum(vlr_realizado) as vlr_cr,
              valor_total_previsto,
              prioridade,
              complexidade,
              polo,
              coordenador_nome,
              nome_responsavel,
              data_inicio,
              data_fim,
              descricao,
              justificativa,
              nome_projeto
            from (
              select 
                c.id,
                case when sum(vlr_planejado) is null 
                  then 0 
                  else sum(vlr_planejado)
                end as vlr_planejado,
                0 as vlr_realizado,
                c.valor_total_previsto,
                pri.prioridade,
                cpx.classificacao AS complexidade,
                pls.polo,
                crd.coordenador_nome,
                rsp.nome_responsavel,
                c.data_inicio,
                c.data_fim,
                c.descricao,
                c.justificativa,
                c.nome_projeto
              from tb_projetos_atividade_custo_plan a
              inner join tb_projetos_atividade b
                on a.id_atividade = b.id
              inner join tb_projetos c
                on b.id_projeto = c.id
              LEFT JOIN tb_prioridades_projetos pri
                ON pri.id = c.prioridade_id
              LEFT JOIN tb_classificacoes_projetos cpx
                ON cpx.id = c.complexidade_id
              LEFT JOIN tb_polos pls
                ON pls.id = c.polo_id
              LEFT JOIN tb_coordenadores crd
                ON crd.id_coordenador = c.coordenador_id
              LEFT JOIN tb_responsaveis rsp
                ON rsp.responsavel_id = c.responsavel_id
              GROUP BY
                c.id,
                c.valor_total_previsto,
                pri.prioridade,
                cpx.classificacao,
                pls.polo,
                crd.coordenador_nome,
                rsp.nome_responsavel,
                c.data_inicio,
                c.data_fim,
                c.descricao,
                c.justificativa,
                c.nome_projeto
              union
              select 
                c.id,
                0 as vlr_planejado,
                case when sum(vlr_realizado) is null 
                  then 0 
                  else sum(vlr_realizado)
                end as vlr_realizado,
                c.valor_total_previsto,
                pri.prioridade,
                cpx.classificacao AS complexidade,
                pls.polo,
                crd.coordenador_nome,
                rsp.nome_responsavel,
                c.data_inicio,
                c.data_fim,
                c.descricao,
                c.justificativa,
                c.nome_projeto
              from tb_projetos_atividade_custo_real a
              inner join tb_projetos_atividade b
                on a.id_atividade = b.id
              inner join tb_projetos c
                on b.id_projeto = c.id
              LEFT JOIN tb_prioridades_projetos pri
                ON pri.id = c.prioridade_id
              LEFT JOIN tb_classificacoes_projetos cpx
                ON cpx.id = c.complexidade_id
              LEFT JOIN tb_polos pls
                ON pls.id = c.polo_id
              LEFT JOIN tb_coordenadores crd
                ON crd.id_coordenador = c.coordenador_id
              LEFT JOIN tb_responsaveis rsp
                ON rsp.responsavel_id = c.responsavel_id
              GROUP BY
                c.id,
                c.valor_total_previsto,
                pri.prioridade,
                cpx.classificacao,
                pls.polo,
                crd.coordenador_nome,
                rsp.nome_responsavel,
                c.data_inicio,
                c.data_fim,
                c.descricao,
                c.justificativa,
                c.nome_projeto
            ) as qr
            GROUP BY 
              qr.id,
              qr.valor_total_previsto,
              qr.prioridade,
              qr.complexidade,
              qr.polo,
              qr.coordenador_nome,
              qr.nome_responsavel,
              qr.data_inicio,
              qr.data_fim,
              qr.descricao,
              qr.justificativa,
              qr.nome_projeto
            ) as qr2
      ) as b
      on a.id = b.id_projeto
      where 
              (a.nome_projeto like('%${nomProjeto}%') or '${nomProjeto}' is null or '${nomProjeto}' = '')
        and a.deletado = false
        and   a.tipo_projeto_id in (1,2)
      order by vlr_ranking desc  
    `;

    return await this.prismaClient.$queryRawUnsafe(query);
  }

  async getProjetosDetalhados() {
    // informações completas detalhadas de um projeto
    const query = `
    select 
    a.id,
    a.nome_projeto,
    responsavel,
    campo_id,
    vlr_cr,
    vlr_orcado,
    case when vlr_orcado = 0 then 0 else case when vlr_cr / vlr_orcado > 1 then 1 else vlr_cr / vlr_orcado end end as vlr_tpci, 
    (
    select opcoes.nom_opcao from tb_ranking ranking
    inner join tb_projetos_ranking projeto_ranking
    on projeto_ranking.id_ranking = ranking.id
    inner join tb_ranking_opcoes opcoes
    on opcoes.id = projeto_ranking.id_opcao 
    where ranking.id = 4
    and projeto_ranking.id_projeto = a.id
    ) as prioridade,
    0 as percent, --case when round(fn_cron_calc_pct_real_regra_aprovada(a.id), 0) > 100 then 100 else round(fn_cron_calc_pct_real_regra_aprovada(a.id), 0) end as percent,
    case when vlr_orcado <= 300000 then
		'B'
   	else 
   		case when vlr_orcado between 300001 and 3000000 then
   			'M'
   		else 
   			'A'
   		end
    end as complexidade,
    polo_id,
    polo,
    coordenador,
    coordenador_id,
    (
    	select
    	case when 
    	min(tpa.dat_ini_plan)
    	is not null
    	then
    	min(tpa.dat_ini_plan)
    	else coalesce(a.data_inicio, b.data_inicio)
    	end
    	from tb_projetos_atividade tpa 
    	where tpa.dat_usu_erase is null
    	and tpa.id_pai = a.id
    ) as data_inicio,
   (
    	select
    	case when 
    	max(tpa.dat_fim_plan)
    	is not null
    	then
    	max(tpa.dat_fim_plan)
    	else coalesce(a.data_fim, b.data_fim)
    	end
    	from tb_projetos_atividade tpa 
    	where tpa.dat_usu_erase is null
    	and tpa.id_pai = a.id
    ) as data_fim,
    round((
    select case when sum(fn_cron_calc_pct_real_projeto(tpa.id, tp.id)) is null then 0 else sum(fn_cron_calc_pct_real_projeto(tpa.id, tp.id)) end from tb_projetos_atividade tpa
    inner join tb_projetos tp
    on tp.id = tpa.id_projeto
    where tp.id = a.id
    ), 2) as pct,
    coalesce(a.descricao, b.descricao) as descricao,
    coalesce(a.justificativa, b.justificativa) as justificativa,
      a.id as id_projeto_real,
      coalesce((
      select vlr_cpi from tb_projetos_spi_cpi
      where id_projeto = a.id
      ), 1) as vlr_cpi,
      coalesce((
      select vlr_spi from tb_projetos_spi_cpi
      where id_projeto = a.id
      ), 1) as vlr_spi,
      case when ranking is null then 0 else ranking end as vlr_ranking
      from tb_projetos a
      left join (select aa.id_projeto, sum(bb.num_nota) as ranking
      from tb_projetos_ranking aa
      inner join tb_ranking_opcoes bb
      on aa.id_ranking = bb.id_ranking 
      and aa.id_opcao = bb.id
      group by aa.id_projeto) as qr4
      on a.id = qr4.id_projeto
      left join (
      select 
            id AS id_projeto,
            trunc(case when coalesce(vlr_cr, 0) = 0 then 1 else vlr_va / vlr_cr end, 2) as vlr_cpi,
            trunc(case when coalesce(vlr_vp, 0) = 0 then 1 else vlr_va / vlr_vp end, 2) as vlr_spi,
            vlr_cr,
            valor_total_previsto AS vlr_orcado,
            prioridade,
            complexidade,
            polo,
            coordenador_nome AS coordenador,
            nome_responsavel AS responsavel,
            data_inicio,
            data_fim,
            0 AS pct,
            descricao,
            justificativa,
            nome_projeto
            from (
            select 
              id,
              (fn_cron_calc_pct_plan_projeto(0, id)/100) * sum(vlr_planejado) as vlr_vp, 
              (fn_cron_calc_pct_real_projeto(0, id)/100) * sum(vlr_planejado) as vlr_va,
              sum(vlr_realizado) as vlr_cr,
              valor_total_previsto,
              prioridade,
              complexidade,
              polo,
              coordenador_nome,
              nome_responsavel,
              data_inicio,
              data_fim,
              descricao,
              justificativa,
              nome_projeto
            from (
              select 
                c.id,
                case when sum(c.valor_total_previsto) is null 
                  then 0 
                  else sum(valor_total_previsto)
                end as vlr_planejado,
                0 as vlr_realizado,
                c.valor_total_previsto,
                pri.prioridade,
                cpx.classificacao AS complexidade,
                pls.polo,
                crd.coordenador_nome,
                rsp.nome_responsavel,
                c.data_inicio,
                c.data_fim,
                c.descricao,
                c.justificativa,
                c.nome_projeto
              from tb_projetos c
              LEFT JOIN tb_prioridades_projetos pri
                ON pri.id = c.prioridade_id
              LEFT JOIN tb_classificacoes_projetos cpx
                ON cpx.id = c.complexidade_id
              LEFT JOIN tb_polos pls
                ON pls.id = c.polo_id
              LEFT JOIN tb_coordenadores crd
                ON crd.id_coordenador = c.coordenador_id
              LEFT JOIN tb_responsaveis rsp
                ON rsp.responsavel_id = c.responsavel_id
              GROUP BY
                c.id,
                c.valor_total_previsto,
                pri.prioridade,
                cpx.classificacao,
                pls.polo,
                crd.coordenador_nome,
                rsp.nome_responsavel,
                c.data_inicio,
                c.data_fim,
                c.descricao,
                c.justificativa,
                c.nome_projeto
              union
              select 
                c.id,
                0 as vlr_planejado,
                case when sum(valor) is null 
                  then 0 
                  else sum(valor)
                end as vlr_realizado,
                c.valor_total_previsto,
                pri.prioridade,
                cpx.classificacao AS complexidade,
                pls.polo,
                crd.coordenador_nome,
                rsp.nome_responsavel,
                c.data_inicio,
                c.data_fim,
                c.descricao,
                c.justificativa,
                c.nome_projeto
              from tb_centro_custo a
              inner join tb_projetos c
                on a.projeto_id = c.id
              LEFT JOIN tb_prioridades_projetos pri
                ON pri.id = c.prioridade_id
              LEFT JOIN tb_classificacoes_projetos cpx
                ON cpx.id = c.complexidade_id
              LEFT JOIN tb_polos pls
                ON pls.id = c.polo_id
              LEFT JOIN tb_coordenadores crd
                ON crd.id_coordenador = c.coordenador_id
              LEFT JOIN tb_responsaveis rsp
                ON rsp.responsavel_id = c.responsavel_id
              WHERE a.dat_usu_erase is null
              GROUP BY
                c.id,
                c.valor_total_previsto,
                pri.prioridade,
                cpx.classificacao,
                pls.polo,
                crd.coordenador_nome,
                rsp.nome_responsavel,
                c.data_inicio,
                c.data_fim,
                c.descricao,
                c.justificativa,
                c.nome_projeto
            ) as qr
            GROUP BY 
              qr.id,
              qr.valor_total_previsto,
              qr.prioridade,
              qr.complexidade,
              qr.polo,
              qr.coordenador_nome,
              qr.nome_responsavel,
              qr.data_inicio,
              qr.data_fim,
              qr.descricao,
              qr.justificativa,
              qr.nome_projeto
            ) as qr2
      ) as b
      on a.id = b.id_projeto
      where 
      a.tipo_projeto_id in (1,2)
      AND a.dat_usu_erase is null
      order by vlr_ranking desc  
    `;

    return await this.prismaClient.$queryRawUnsafe(query);
  }

  async create(createProjetoDto: CreateProjetoDto) {
    //cria um novo projeto, utilizado na tela de cadastro de um projeto
    const capexValor = createProjetoDto.capexPrevisto
      .replace('.', '')
      .replace(',', '');

    const formatado = `${capexValor.substring(
      0,
      capexValor.length - 2,
    )}.${capexValor.substring(capexValor.length - 2)}`;

    const retorno = await this.prismaClient.$queryRawUnsafe(`
      INSERT INTO tb_projetos(nome_projeto, descricao, justificativa, valor_total_previsto, polo_id, local_id, solicitante_id, classificacao_id, divisao_id, gate_id, tipo_projeto_id, status_id, prioridade_id, comentarios, responsavel_id, coordenador_id, elemento_pep, nom_usu_create, campo_id) VALUES ('${
        createProjetoDto.nomeProjeto
      }', '${createProjetoDto.descricao}',  '${
      createProjetoDto.justificativa
    }', ${Number(formatado)}, ${createProjetoDto.poloId}, ${
      createProjetoDto.localId
    }, ${createProjetoDto.solicitanteId}, ${
      createProjetoDto.classificacaoId
    }, ${createProjetoDto.divisaoId}, ${createProjetoDto.gateId}, ${
      createProjetoDto.tipoProjetoId
    }, ${createProjetoDto.statusId}, 1, '${createProjetoDto.comentarios}', ${
      createProjetoDto.responsavelId
    }, ${createProjetoDto.coordenadorId}, '${createProjetoDto.elementoPep}', '${
      createProjetoDto.nom_usu_create
    }', '${createProjetoDto.campoId}')
      RETURNING id
    `);

    await this.prismaClient.$queryRawUnsafe(`
      INSERT INTO tb_projetos_ranking (id_projeto, id_ranking, id_opcao, dsc_comentario, nom_usu_create, dat_usu_create)
      VALUES (${retorno[0].id}, 4, 12, '', '${createProjetoDto.nom_usu_create}', now())
    `);

    return retorno;
  }

  async findAllProjetosPrazos() {
    return this.prismaClient.$queryRawUnsafe(`
    select 
      *,
      '' as nome_responsavel,
      fn_hrs_uteis_totais_atv(dat_ini_plan, dat_fim_plan) as hrs_totais,
      case when fn_hrs_uteis_totais_atv(dat_ini_real, dat_fim_real) is null then 0 else fn_hrs_uteis_totais_atv(dat_ini_real, dat_fim_real) end as hrs_reais,
      0.00 as vlr_custo
  from tb_projetos_atividade a
  order by id_pai asc, dat_ini_plan asc;`);
  }

  async findProjetosPrazos(id: number) {
    return this.prismaClient.$queryRawUnsafe(`    
   select 
      *,
      '' as nome_responsavel,
      fn_hrs_uteis_totais_atv(dat_ini_plan, dat_fim_plan) as hrs_totais,
      case when fn_hrs_uteis_totais_atv(dat_ini_real, dat_fim_real) is null then 0 else fn_hrs_uteis_totais_atv(dat_ini_real, dat_fim_real) end as hrs_reais,
      0.00 as vlr_custo
  from tb_projetos_atividade a
  where id_projeto = ${id}
  order by id_pai asc, dat_ini_plan asc;
    `);
  }

  async findProjetosPercentuais(id: number) {
    return this.prismaClient.$queryRawUnsafe(`
    select 
      *,
      round(fn_cron_calc_pct_plan_aprovada(a.id),1) as pct_plan,
      round(fn_cron_calc_pct_real_regra_aprovada(a.id),1) as pct_real
    from tb_projetos a
    left join tb_projetos_atividade b 
        on a.id = b.id_projeto 
    where 
        a.nome_projeto = b.nom_atividade
    and a.id = ${id};
`);
  }

  async projetoConfig(id: number) {
    const query = await this.prismaClient.$queryRawUnsafe(`
    select projeto.*, polo.polo, locais.local, solicitantes.solicitante, classificacao.classificacao, resp.nome_responsavel, coord.coordenador_nome ,divisoes.divisao, gates.gate, tipos.tipo, status.status from tb_projetos projeto
    inner join tb_polos polo
    on polo.id = projeto.polo_id
    inner join tb_locais locais
    on locais.id = projeto.local_id
    inner join tb_solicitantes_projetos solicitantes
    on solicitantes.id = projeto.solicitante_id
    inner join tb_classificacoes_projetos classificacao
    on classificacao.id = projeto.classificacao_id
    inner join tb_divisoes_projetos divisoes
    on divisoes.id = projeto.divisao_id
    inner join tb_gates gates
    on gates.id = projeto.gate_id
    inner join tb_tipos_projeto tipos
    on tipos.id = projeto.tipo_projeto_id
    inner join tb_status_projetos status
    on status.id = projeto.status_id
    inner join tb_responsaveis resp
    on resp.responsavel_id = projeto.responsavel_id
    inner join tb_coordenadores coord
    on coord.id_coordenador = projeto.coordenador_id
    where
    projeto.id = ${id};
    `);

    if (!query[0]?.valor_total_previsto.toString().includes('.')) {
      query[0].valor_total_previsto = query[0].valor_total_previsto + '.00';
    }

    return query;
  }

  async findChaves() {
    return this.prismaClient.$queryRawUnsafe(`
    SELECT id, nome_projeto FROM tb_projetos WHERE tipo_projeto_id <> 3
    `);
  }

  async findAll() {
    const projects = await this.prismaClient.projeto.findMany();
    if (!projects) throw new Error('Falha na listagem de projetos');
    return projects;
  }

  async previstoXRealizadoGeral() {
    const query: any[] = await this.prismaClient.$queryRawUnsafe(`
    select * from
    (
      select 
      concat(substring(namemonth(right(mesano::varchar,2)::int4) from 1 for 3), '/', left(mesano::varchar,4)) as mes,
      mesano,
      case when max(a.pct_plan) is null then 0 else max(a.pct_plan) * 100 end as pct_plan,
      case when max(a.pct_real) is null then 0 else max(a.pct_real) * 100 end as pct_real,
      case when max(a.pct_capex_plan) is null then 0 else max(a.pct_capex_plan) * 100 end as capex_previsto,
      case when max(a.pct_capex_real) is null then 0 else max(a.pct_capex_real) * 100 end as capex_realizado
      from tb_grafico_curva_s a
      group by 1, 2
      order by mesano desc
      limit 12
    ) qr
    order by 2
    `);

    return query.map((el) => {
      return {
        mes: el.mes,
        cronogramaPrevisto: Number(el.pct_plan),
        cronogramaRealizado: Number(el.pct_real),
        capexPrevisto: Number(el.capex_previsto),
        capexRealizado: Number(el.capex_realizado),
      };
    });
  }

  async buscarDadosCurvaSGeral() {
    try {
      await this.prismaClient.$queryRawUnsafe(`
        CALL sp_in_graf_curva_s_geral()
      `);
    } finally {
      const query: any[] = await this.prismaClient.$queryRawUnsafe(`
      select 
        concat(substring(namemonth(right(b.mesano::varchar,2)::int4) from 1 for 3), '/', left(b.mesano::varchar,4)) as mes,
        case when a.mesano is null then b.mesano else a.mesano end as mesano,
        case when max(a.pct_plan) is null then 0 else max(a.pct_plan) end as pct_plan,
        case when max(a.pct_real) is null then 0 else max(a.pct_real) end as pct_real,
        case when max(a.pct_capex_plan) is null then 0 else max(a.pct_capex_plan) end as capex_previsto,
        case when max(a.pct_capex_real) is null then 0 else max(a.pct_capex_real) end as capex_realizado
      from tb_projeto_curva_s_geral a
      right join tb_mesano b 
        on a.mesano = b.mesano
      group by 1, 2
      order by mesano
    ;`);

      return query.map((el) => {
        return {
          mes: el.mes,
          cronogramaPrevisto: Number(el.pct_plan),
          cronogramaRealizado: Number(el.pct_real),
          capexPrevisto: Number(el.capex_previsto),
          capexRealizado: Number(el.capex_realizado),
        };
      });
    }
  }

  async previstoXRealizadoGeralPorProjeto(id: number) {
    try {
      await this.prismaClient.$queryRawUnsafe(`
        CALL sp_in_graf_curva_s(${id})
      `);
    } finally {
      const query: any[] = await this.prismaClient.$queryRawUnsafe(`
      select 
      concat(substring(namemonth(right(mesano::varchar,2)::int4) from 1 for 3), '/', left(mesano::varchar,4)) as mes,
      mesano,
      case when max(a.pct_plan) is null then 0 else max(a.pct_plan) * 100 end as pct_plan,
      case when max(a.pct_real) is null then 0 else max(a.pct_real) * 100 end as pct_real,
      case when max(a.pct_capex_plan) is null then 0 else max(a.pct_capex_plan) * 100 end as capex_previsto,
      case when max(a.pct_capex_real) is null then 0 else max(a.pct_capex_real) * 100 end as capex_realizado
    from tb_grafico_curva_s a
    where a.id_projeto = ${id} 
    group by 1, 2
    order by mesano
    ;`);

      return query.map((el) => {
        return {
          mes: el.mes,
          cronogramaPrevisto: Number(el.pct_plan),
          cronogramaRealizado: Number(el.pct_real),
          capexPrevisto: Number(el.capex_previsto),
          capexRealizado: Number(el.capex_realizado),
        };
      });
    }
  }

  async findTotalValue(id: number) {
    const totalValue = await this.prismaClient.$queryRaw(Prisma.sql`
    select
      id,
      data_inicio_formatada,
      data_fim_formatada,
      meses,
      valor_total_previsto
    from
        v_grafico_curva_s
    where
        data_fim > data_inicio
        and valor_total_previsto is not null
        and id = ${id};`);
    if (!totalValue) throw new Error('Valor total previsto não existe');
    return totalValue;
  }

  async findOne(id: number) {
    const project = await this.prismaClient.projeto.findUnique({
      where: { id },
    });
    return project;
  }

  async update(id: number, updateProjetoDto: UpdateProjetoDto) {
    return await this.prismaClient.$queryRawUnsafe(`
      UPDATE tb_projetos
      SET 
      responsavel_id = ${updateProjetoDto.nome_responsavel},
      coordenador_id = ${updateProjetoDto.coordenador_nome},
      status_id = ${updateProjetoDto.status},
      polo_id = ${updateProjetoDto.polo},
      local_id = ${updateProjetoDto.local},
      solicitante_id = ${updateProjetoDto.solicitacao},
      nome_projeto = '${updateProjetoDto.nome_projeto}',
      elemento_pep = '${updateProjetoDto.elemento_pep}',
      valor_total_previsto = ${updateProjetoDto.valor_total_previsto},
      data_inicio = ${
        updateProjetoDto.data_inicio === null
          ? null
          : "'" + new Date(updateProjetoDto.data_inicio).toISOString() + "'"
      },
      data_fim = ${
        updateProjetoDto.data_fim === null
          ? null
          : "'" + new Date(updateProjetoDto.data_fim).toISOString() + "'"
      },
      divisao_id = ${updateProjetoDto.divisao},
      classificacao_id= ${updateProjetoDto.classificacao},
      tipo_projeto_id = ${updateProjetoDto.tipo},
      gate_id = ${updateProjetoDto.gate},
      "dataInicio_real" = ${
        updateProjetoDto.data_inicio_real === null
          ? null
          : "'" +
            new Date(updateProjetoDto.data_inicio_real).toISOString() +
            "'"
      },
      "dataFim_real"=${
        updateProjetoDto.data_fim_real === null
          ? null
          : "'" + new Date(updateProjetoDto.data_fim_real).toISOString() + "'"
      },
      campo_id = '${updateProjetoDto.campoId}',
      dat_usu_update=now()
      WHERE id = ${id}
    `);
  }

  async updateDescricaoJustificativa(
    id: number,
    updateProjetoDto: UpdateProjetoDto,
  ) {
    return await this.prismaClient.$queryRawUnsafe(`
    UPDATE tb_projetos
    SET
    descricao='${updateProjetoDto.descricao}',
    justificativa='${updateProjetoDto.justificativa}',
    dat_usu_update=now()
    where id=${id}
    `);
  }

  async remove(id: number, user: string) {
    return await this.prismaClient.$queryRawUnsafe(`UPDATE tb_projetos
    SET DELETADO = TRUE,
    dat_usu_erase = now(), 
    nom_usu_erase = '${user}'
    WHERE id = ${id}`);
  }

  async countAll() {
    const count = await this.prismaClient.projeto.count();
    if (!count) throw new Error('Falha na contagem de projetos');
    return count;
  }

  async verificarRelacoes(id: number) {
    const retorno: any[] = await this.prismaClient.$queryRawUnsafe(`
    select
    coalesce(atividades.id, projetos.id) as id,
    coalesce(atividades.nom_atividade, projetos.nome_projeto) as valor
    from
    tb_projetos_atividade atividades
    right join tb_projetos projetos
    on projetos.id = atividades.id_projeto
    where
    projetos.id = ${id} and atividades.dat_usu_erase is null and projetos.dat_usu_erase is null
    `);

    if (retorno.length > 0) {
      return retorno;
    } else {
      return await this.prismaClient.$queryRawUnsafe(`
      select coalesce(b.id, a.id) as id, coalesce(b.nom_atividade, a.nome_projeto) as valor from tb_projetos a
      left join tb_projetos_atividade b
      on b.id_projeto = a.id
      where a.id = ${id} and (b.id_pai = 0 or b.id_pai is null)
      `);
    }
  }

  async verificarRelacoesExecucao(id: number) {
    return this.prismaClient.$queryRawUnsafe(`
    select
    coalesce(atividades.id, projetos.id) as id,
    coalesce(atividades.nom_atividade, projetos.nome_projeto) as valor
    from
    tb_projetos_atividade atividades
    right join tb_projetos projetos
    on projetos.id = atividades.id_projeto
    where
    id_pai = ${id} and atividades.dat_usu_erase is null and projetos.dat_usu_erase is null
    `);
  }

  async vincularAtividade(vincularAtividade: VincularAtividade) {
    const projeto: any[] = await this.prismaClient.$queryRawUnsafe(`
      SELECT * FROM tb_projetos WHERE id = ${vincularAtividade.relacao_id}
    `);

    const existe = await this.prismaClient.$queryRawUnsafe(`
      SELECT count(*) existe FROM tb_projetos_atividade WHERE (id_projeto = ${
        projeto === null || projeto.length === 0 ? null : projeto[0].id
      } and (id_pai = 0 OR id_pai IS NULL)) OR id = ${
      vincularAtividade.relacao_id
    }  
    `);

    const data_tratado = new Date(
      new Date(vincularAtividade.dat_inicio_plan).getTime() +
        3 * 3600 -
        9 * 60 * 60 * 1000,
    );

    Logger.log(data_tratado);
    const dat_ini = data_tratado.toISOString(); //new Date(vincularAtividade.dat_inicio_plan).toISOString();
    const data_fim_tratado = addWorkDays(
      new Date(dat_ini),
      vincularAtividade.duracao_plan + 1, // o front está subtraindo um dia da duração, sabe lá por que...
    );

    const dat_fim = new Date(
      new Date(data_fim_tratado).getTime() + 9 * 60 * 60 * 1000,
    );

    if (existe[0].existe > 0) {
      const id_ret = await this.prismaClient.$queryRawUnsafe(`
        SELECT * FROM tb_projetos_atividade WHERE (id_projeto = ${
          projeto === null || projeto.length === 0 ? null : projeto[0].id
        } and id = ${vincularAtividade.relacao_id}) OR id =  ${
        vincularAtividade.relacao_id
      }
      `);

      const id_atv = await this.prismaClient.$queryRawUnsafe(`
        INSERT INTO tb_projetos_atividade (ID_PAI, NOM_ATIVIDADE, PCT_REAL, DAT_INI_PLAN, DAT_INI_REAL, DAT_FIM_PLAN, DAT_FIM_REAL, NOM_USU_CREATE, DAT_USU_CREATE, ID_PROJETO, ID_RESPONSAVEL, macro_id)
        VALUES (${id_ret[0].id}, '${vincularAtividade.nom_atividade.replace(
        /['"]+/g,
        '',
      )}', 0, '${dat_ini}', '${dat_ini}', '${dat_fim.toISOString()}', '${dat_fim.toISOString()}', '${
        vincularAtividade.nom_usu_create
      }', NOW(), ${vincularAtividade.id_projeto}, ${
        vincularAtividade.responsavel_id
      }, ${vincularAtividade.macro_id})
        RETURNING ID
      `);

      vincularAtividade.precedentes.forEach(async (p) => {
        await this.prismaClient.$queryRawUnsafe(`
          insert into tb_projetos_atividade_precedentes (id_atv, id_prec, dias)
          values
          (${id_atv[0].id}, ${p.atividadePrecedenteId}, ${p.dias})
        `);
      });
    } else {
      const id_ret = await this.prismaClient.$queryRawUnsafe(`
        INSERT INTO tb_projetos_atividade (NOM_ATIVIDADE, PCT_REAL, ID_PROJETO, DAT_INI_PLAN, DAT_FIM_PLAN, NOM_USU_CREATE, DAT_USU_CREATE)
        VALUES ('${projeto[0].nome_projeto}', 0, ${projeto[0].id}, ${
        projeto[0].data_inicio === null
          ? null
          : "'" + new Date(projeto[0].data_inicio).toISOString() + "'"
      }, ${
        projeto[0].data_fim === null
          ? null
          : "'" + new Date(projeto[0].data_fim).toISOString() + "'"
      }, '${vincularAtividade.nom_usu_create}', NOW() )
        RETURNING ID;
      `);

      const dat_ini = new Date(vincularAtividade.dat_inicio_plan);
      const dat_fim = addWorkDays(
        new Date(dat_ini),
        vincularAtividade.duracao_plan,
      );

      const id_atv = await this.prismaClient.$queryRawUnsafe(`
        INSERT INTO tb_projetos_atividade (ID_PAI, NOM_ATIVIDADE, PCT_REAL, DAT_INI_PLAN, DAT_INI_REAL, DAT_FIM_PLAN, DAT_FIM_REAL, NOM_USU_CREATE, DAT_USU_CREATE, ID_PROJETO, ID_RESPONSAVEL)
        VALUES (${id_ret[0].id}, '${
        vincularAtividade.nom_atividade
      }', 0, '${dat_ini.toISOString()}', '${dat_ini.toISOString()}', '${dat_fim.toISOString()}', '${dat_fim.toISOString()}', '${
        vincularAtividade.nom_usu_create
      }', NOW(), ${vincularAtividade.id_projeto}, ${
        vincularAtividade.responsavel_id
      })
        RETURNING ID
      `);

      vincularAtividade.precedentes.forEach(async (p) => {
        await this.prismaClient.$queryRawUnsafe(`
          insert into tb_projetos_atividade_precedentes (id_atv, id_prec, dias)
          values
          (${id_atv[0].id}, ${p.atividadePrecedenteId}, ${p.dias})
        `);
      });

      await this.prismaClient.$executeRawUnsafe(`
      call sp_cron_atv_update_datas_pcts_pais(${id_atv[0].id});
      `);

      await this.prismaClient.$executeRawUnsafe(`
        update tb_projetos set dat_usu_update = now() where id = (${vincularAtividade.id_projeto});
      `);
    }
  }

  async gerarIds() {
    return await this.prismaClient.$queryRawUnsafe(`
    select 
    concat('P', right(concat('0000', ((count(campo_id) filter (where left(campo_id, 1) = 'P' )) + 1)::integer ), 5)) as id_projeto,
    concat('E', right(concat('0000', ((count(campo_id) filter (where left(campo_id, 1) = 'E' )) + 1)::integer ), 5)) as id_estudo
    from tb_projetos
    `);
  }
}
