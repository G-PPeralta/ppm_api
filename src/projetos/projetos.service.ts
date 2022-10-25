import { Injectable } from '@nestjs/common';
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
              (dev.fn_cron_calc_pct_plan_projeto(0, id)/100) * sum(vlr_planejado) as vlr_vp, 
              (dev.fn_cron_calc_pct_real_projeto(0, id)/100) * sum(vlr_planejado) as vlr_va,
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
              from dev.tb_projetos_atividade_custo_plan a
              inner join dev.tb_projetos_atividade b
                on a.id_atividade = b.id
              inner join dev.tb_projetos c
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
              from dev.tb_projetos_atividade_custo_real a
              inner join dev.tb_projetos_atividade b
                on a.id_atividade = b.id
              inner join dev.tb_projetos c
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
        and   a.tipo_projeto_id in (1,2)
      order by vlr_ranking desc  
    `;

    return await this.prismaClient.$queryRawUnsafe(query);
  }

  async getProjetosDetalhados() {
    const query = `
    select 
    a.id,
    a.nome_projeto,
    responsavel,
    vlr_cr,
    vlr_orcado,
    (
    select opcoes.nom_opcao from tb_ranking ranking
    inner join tb_projetos_ranking projeto_ranking
    on projeto_ranking.id_ranking = ranking.id
    inner join tb_ranking_opcoes opcoes
    on opcoes.id = projeto_ranking.id_opcao 
    where ranking.id = 4
    and projeto_ranking.id_projeto = a.id
    ) as prioridade,
    (
    select opcoes.nom_opcao from tb_ranking ranking
    inner join tb_projetos_ranking projeto_ranking
    on projeto_ranking.id_ranking = ranking.id
    inner join tb_ranking_opcoes opcoes
    on opcoes.id = projeto_ranking.id_opcao 
    where ranking.id = 5
    and projeto_ranking.id_projeto = a.id
    ) as complexidade,
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
              (dev.fn_cron_calc_pct_plan_projeto(0, id)/100) * sum(vlr_planejado) as vlr_vp, 
              (dev.fn_cron_calc_pct_real_projeto(0, id)/100) * sum(vlr_planejado) as vlr_va,
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
              from dev.tb_centro_custo a
              inner join dev.tb_projetos c
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
      order by vlr_ranking desc  
    `;

    return await this.prismaClient.$queryRawUnsafe(query);
  }

  async create(createProjetoDto: CreateProjetoDto) {
    const capexValor = createProjetoDto.capexPrevisto
      .replace('.', '')
      .replace(',', '');

    const formatado = `${capexValor.substring(
      0,
      capexValor.length - 2,
    )}.${capexValor.substring(capexValor.length - 2)}`;

    return await this.prismaClient.$queryRawUnsafe(`
      INSERT INTO tb_projetos(nome_projeto, descricao, justificativa, valor_total_previsto, polo_id, local_id, solicitante_id, classificacao_id, divisao_id, gate_id, tipo_projeto_id, status_id, comentarios, responsavel_id, coordenador_id, elemento_pep, nom_usu_create) VALUES ('${
        createProjetoDto.nomeProjeto
      }', '${createProjetoDto.descricao}',  '${
      createProjetoDto.justificativa
    }', ${Number(formatado)}, '${new Date(
      createProjetoDto.dataInicio,
    ).toISOString()}', ${createProjetoDto.poloId}, ${
      createProjetoDto.localId
    }, ${createProjetoDto.solicitanteId}, ${
      createProjetoDto.classificacaoId
    }, ${createProjetoDto.divisaoId}, ${createProjetoDto.gateId}, ${
      createProjetoDto.tipoProjetoId
    }, ${createProjetoDto.statusId}, 1, ${createProjetoDto.complexidadeId}, '${
      createProjetoDto.comentarios
    }', ${createProjetoDto.responsavelId}, ${
      createProjetoDto.coordenadorId
    }, '${createProjetoDto.elementoPep}', '${createProjetoDto.nom_usu_create}')
    `);
  }

  async findAllProjetosPrazos() {
    return this.prismaClient.$queryRawUnsafe(`
    select 
      *,
      '' as nome_responsavel,
      dev.fn_hrs_uteis_totais_atv(dat_ini_plan, dat_fim_plan) as hrs_totais,
      case when dev.fn_hrs_uteis_totais_atv(dat_ini_real, dat_fim_real) is null then 0 else dev.fn_hrs_uteis_totais_atv(dat_ini_real, dat_fim_real) end as hrs_reais,
      0.00 as vlr_custo
  from dev.tb_projetos_atividade a
  order by id_pai asc, dat_ini_plan asc;`);
  }

  async findProjetosPrazos(id: number) {
    return this.prismaClient.$queryRawUnsafe(`    
   select 
      *,
      '' as nome_responsavel,
      dev.fn_hrs_uteis_totais_atv(dat_ini_plan, dat_fim_plan) as hrs_totais,
      case when dev.fn_hrs_uteis_totais_atv(dat_ini_real, dat_fim_real) is null then 0 else dev.fn_hrs_uteis_totais_atv(dat_ini_real, dat_fim_real) end as hrs_reais,
      0.00 as vlr_custo
  from dev.tb_projetos_atividade a
  where id_projeto = ${id}
  order by id_pai asc, dat_ini_plan asc;
    `);
  }

  async findProjetosPercentuais(id: number) {
    return this.prismaClient.$queryRawUnsafe(`
    select 
    *,
    round(dev.fn_cron_calc_pct_plan(b.id),1) as pct_plan,
    round(dev.fn_cron_calc_pct_real(b.id),1) as pct_real
from dev.tb_projetos a
left join dev.tb_projetos_atividade b 
    on a.id = b.id_projeto 
where 
    b.id_pai = 0 or b.id_pai is null
and a.id = ${id};
`);
  }

  async projetoConfig(id: number) {
    return await this.prismaClient.$queryRawUnsafe(`
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
  }

  async findAll() {
    const projects = await this.prismaClient.projeto.findMany();
    if (!projects) throw new Error('Falha na listagem de projetos');
    return projects;
  }

  async previstoXRealizadoGeral() {
    const query: any[] = await this.prismaClient.$queryRawUnsafe(`
    select 
    concat(substring(namemonth(mes::int4) from 1 for 3), '/', ano) as mes,
    round(avg(pct_plan)::numeric, 2) as pct_plan,
    round(avg(pct_real)::numeric, 2) as pct_real,
    avg(pct_capex_plan) as capex_previsto,
    avg(pct_capex_real) as capex_realizado
  from (
      select 
        ano,
        mes,
        case when sum(horas_totais_plan) = 0 or sum(horas_totais_plan) is null then 0 else (sum(horas_planejadas)/sum(horas_totais_plan))*100 end as pct_plan,
        case when sum(horas_totais_real) = 0 or sum(horas_totais_real) is null then 0 else (sum(horas_realizadas)/sum(horas_totais_real))*100 end as pct_real,
        sum(vlr_plan) as pct_capex_plan,
        sum(vlr_real) as pct_capex_real
      from (	
        select 
           extract(year from dat_ini_plan) as ano,
           extract(month from dat_ini_plan) as mes,
           concat(extract(year from dat_ini_plan), extract(month from dat_ini_real)) as mesano,
           (dev.fn_hrs_uteis_totais_atv(dat_ini_plan, dat_fim_plan)) as horas_totais_plan,
           case when (dev.fn_hrs_uteis_totais_atv(dat_ini_plan, case when dat_fim_plan <= current_date then dat_fim_plan else current_date end)) <= 0 then 0
           else 
             (dev.fn_hrs_uteis_totais_atv(dat_ini_plan, case when dat_fim_plan <= current_date then dat_fim_plan else current_date end))
           end as horas_planejadas,
           0 as horas_totais_real,
           0 as horas_realizadas,
           0 as vlr_plan,
           0 as vlr_real
        from dev.tb_projetos_atividade tpa 
        where dat_usu_erase is null
        and dat_ini_plan between '2022-01-01 00:00:00' and '2022-12-31 23:59:59' -- and id_projeto = 519
        union
        select 
           extract(year from dat_ini_plan) as ano,
           extract(month from dat_ini_plan) as mes,
            concat(extract(year from dat_ini_plan), extract(month from dat_ini_real)) as mesano,
           0 as horas_totais_plan,
           0 as horas_planejadas,
           (dev.fn_hrs_uteis_totais_atv(dat_ini_plan, dat_fim_plan)) as horas_totais_real,
           (dev.fn_hrs_uteis_totais_atv(dat_ini_plan, dat_fim_plan)) * (pct_real/100) as horas_realizadas,
           0 as vlr_plan,
           0 as vlr_real
        from dev.tb_projetos_atividade tcac where dat_usu_erase is null -- and id_projeto = 519
        and dat_ini_plan between '2022-01-01 00:00:00' and '2022-12-31 23:59:59'
      ) as qr
    group by ano, mes
  ) as qr2
  group by ano, mes
  order by ano, mes desc
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

  async previstoXRealizadoGeralPorProjeto(id: number) {
    await this.prismaClient.$queryRawUnsafe(`
      CALL sp_in_graf_curva_s(${id})
    `);
    const query: any[] = await this.prismaClient.$queryRawUnsafe(`
        select 
          concat(substring(namemonth(right(b.mesano::varchar,2)::int4) from 1 for 3), '/', left(b.mesano::varchar,4)) as mes,
          case when a.mesano is null then b.mesano else a.mesano end as mesano,
          case when a.pct_plan is null then 0 else a.pct_plan end as pct_plan,
          case when a.pct_real is null then 0 else a.pct_real end as pct_real,
          case when a.pct_capex_plan is null then 0 else a.pct_capex_plan end as capex_previsto,
          case when a.pct_capex_real is null then 0 else a.pct_capex_real end as capex_realizado
        from tb_projeto_curva_s a
        right join tb_mesano b 
          on a.mesano = b.mesano
        where a.id_projeto = ${id} or a.hrs_totais is null;
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

  async findTotalValue(id: number) {
    const totalValue = await this.prismaClient.$queryRaw(Prisma.sql`
    select
      id,
      data_inicio_formatada,
      data_fim_formatada,
      meses,
      valor_total_previsto
    from
        dev.v_grafico_curva_s
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

  // async update(id: number, updateProjetoDto: UpdateProjetoDto) {
  //   const projeto = await this.prismaClient.projeto.update({
  //     where: {
  //       id,
  //     },
  //     data: updateProjetoDto,
  //   });

  //   return projeto;
  // }

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
      data_inicio = '${updateProjetoDto.data_inicio}',
      data_fim = '${updateProjetoDto.data_fim}',
      divisao_id = ${updateProjetoDto.divisao},
      classificacao_id= ${updateProjetoDto.classificacao},
      tipo_projeto_id = ${updateProjetoDto.tipo},
      gate_id = ${updateProjetoDto.gate},
      dataInicio_real = '${updateProjetoDto.data_inicio_real}',
      dataFim_real='${updateProjetoDto.data_fim_real}'
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
    justificativa='${updateProjetoDto.justificativa}'
    `);
  }

  remove(id: number) {
    return `This action removes a #${id} projeto`;
  }

  async countAll() {
    const count = await this.prismaClient.projeto.count();
    if (!count) throw new Error('Falha na contagem de projetos');
    return count;
  }

  async verificarRelacoes(id: number) {
    return this.prismaClient.$queryRawUnsafe(`
    select
    coalesce(atividades.id, projetos.id) as id,
    coalesce(atividades.nom_atividade, projetos.nome_projeto) as valor
    from
    tb_projetos_atividade atividades
    right join tb_projetos projetos
    on projetos.id = atividades.id_projeto
    where
    projetos.id = ${id}
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

    const dat_ini = new Date(
      vincularAtividade.dat_inicio_plan.replace(/\//g, '-').replace(' ', 'T'),
    );

    dat_ini.setHours(dat_ini.getHours() - 3);

    const dat_fim = addWorkDays(
      new Date(dat_ini),
      vincularAtividade.duracao_plan,
    );

    dat_fim.setHours(dat_ini.getHours() - 3);

    if (existe[0].existe > 0) {
      const id_ret = await this.prismaClient.$queryRawUnsafe(`
        SELECT * FROM tb_projetos_atividade WHERE (id_projeto = ${
          projeto === null || projeto.length === 0 ? null : projeto[0].id
        } and id = ${vincularAtividade.relacao_id}) OR id =  ${
        vincularAtividade.relacao_id
      }
      `);

      await this.prismaClient.$queryRawUnsafe(`
        INSERT INTO tb_projetos_atividade (ID_PAI, NOM_ATIVIDADE, PCT_REAL, DAT_INI_PLAN, DAT_INI_REAL, DAT_FIM_PLAN, DAT_FIM_REAL, NOM_USU_CREATE, DAT_USU_CREATE, ID_PROJETO, ID_RESPONSAVEL)
        VALUES (${id_ret[0].id}, '${
        vincularAtividade.nom_atividade
      }', 0, '${dat_ini.toISOString()}', '${dat_ini.toISOString()}', '${dat_fim.toISOString()}', '${dat_fim.toISOString()}', '${
        vincularAtividade.nom_usu_create
      }', NOW(), ${vincularAtividade.id_projeto}, ${
        vincularAtividade.responsavel_id
      })`);
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

      await this.prismaClient.$executeRawUnsafe(`
      call dev.sp_cron_atv_update_datas_pcts_pais(${id_atv[0].id});
      `);
    }
  }
}
