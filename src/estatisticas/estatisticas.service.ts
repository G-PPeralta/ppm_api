/**
 *  CRIADO EM: 16/11/2022
 *  AUTOR: Felipe Mateus
 *  DESCRIÇÃO DO ARQUIVO: Manipulação informações pertinestes a estatisticas
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateEstatisticaDto } from './dto/create-estatistica.dto';
import { EstatisticaDto } from './dto/update-estatistica.dto';

@Injectable()
export class EstatisticasService {
  constructor(private prisma: PrismaService) {}

  async estatisticasProjeto() {
    let retorno: any[] = [];
    retorno = await this.prisma.$queryRawUnsafe(`
    select
    sonda.id as id_sonda,
    sonda.nom_atividade as sonda,
    pocos.nom_atividade as poco,
    pocos.id as id_poco,
    sonda.ordem as ordem,
    (select count(*) from tb_projetos_atividade where id_pai = pocos.id)::integer as total_atv,
    case when atividades.ordem = 1 then
        case when (select case when coalesce(ind_status, 0) is null then 0 else coalesce(ind_status, 0) end from tb_projetos_atv_status where id_pai = pocos.id) in (1) then
        0
      else 
        case when (select case when coalesce(ind_status, 0) is null then 0 else coalesce(ind_status, 0) end from tb_projetos_atv_status where id_pai = pocos.id) in (2) then 
          3
        else 
          1
        end
        end
    else 
      case when (select case when coalesce(ind_status, 0) is null then 0 else coalesce(ind_status, 0) end from tb_projetos_atv_status where id_pai = pocos.id) in (2) then
        3
      else 
        0
      end
    end as flag,
    coalesce (
    (
    select
      ind_atv_execucao
    from
      tb_camp_atv_campanha
    where
      id_pai = tcac.id
      and ind_atv_execucao = 1
      and pct_real > 0),
    0)
     as flag_old,
    coalesce (
      (
        select
          distinct ordem
        from
          tb_camp_atv_campanha
        where
          poco_id = pocos.id)
      , 0) as num_ordem,
    case
      when atividades.nom_atividade is null then tarefas.nom_operacao
      else atividades.nom_atividade
    end as nome_atividade,
    atividades.id as id_atividade,
    --verificar se é id da atividade ou da origem
          0.00 as custo,
    atividades.dat_ini_plan as inicio_planejado,
    atividades.dat_fim_plan as fim_planejado,
    fn_hrs_totais_cronograma_atvv(atividades.dat_ini_plan,
    atividades.dat_fim_plan) as hrs_totais,
    case
      when fn_hrs_totais_cronograma_atvv(atividades.dat_ini_real,
      atividades.dat_fim_real) is null then 0
      else fn_hrs_totais_cronograma_atvv(atividades.dat_ini_real,
      atividades.dat_fim_real)
    end as hrs_reais,
    atividades.dat_ini_real as inicio_real,
    atividades.dat_fim_real as fim_real,
    round(fn_atv_calc_pct_plan(
    fn_atv_calcular_hrs(atividades.dat_ini_plan), -- horas executadas
    fn_hrs_uteis_totais_atv(atividades.dat_ini_plan, atividades.dat_fim_plan), -- horas totais
    fn_hrs_uteis_totais_atv(atividades.dat_ini_plan, atividades.dat_fim_plan) / fn_atv_calc_hrs_totais_por_data(atividades.dat_ini_plan)-- valor ponderado
              )* 100, 1) as pct_plan,
    coalesce(atividades.pct_real, 0) as pct_real,
    responsaveis.nome_responsavel as nome_responsavel,
    case when calc.vlr_min is null then 0 else round(calc.vlr_min) end as vlr_min,
    case when calc.vlr_max is null then 0 else round(calc.vlr_max) end as vlr_max,
    case when calc.vlr_med is null then 0 else round(calc.vlr_med) end as vlr_media,
    case when calc.vlr_dp is null then 0 else round(calc.vlr_dp) end as vlr_dp,
    (
    select
      min(dat_ini_real)
    from
      tb_projetos_atividade
    where
      id_pai = pocos.id) as dat_inicio,
    (
    select
      max(dat_fim_real)
    from
      tb_projetos_atividade
    where
      id_pai = pocos.id) as dat_final,
    (fn_cron_calc_pct_real(pocos.id)) as pct_real_consol
  from
    tb_projetos_atividade sonda
  inner join tb_projetos_atividade pocos
          on
    pocos.id_pai = sonda.id
  left join tb_projetos_atividade atividades
          on
    (atividades.id_pai = pocos.id)
  left join tb_camp_atv_campanha tcac on
    pocos.id = tcac.poco_id
  left join tb_projetos_operacao tarefas
          on
    (tarefas.id = atividades.id_operacao)
  left join tb_responsaveis responsaveis
          on
    responsaveis.responsavel_id = atividades.id_responsavel
    left join (
      select 	
        b.id,
          b.nom_atividade,
          min(hrs_totais) as vlr_min,
          round(sum(log(hrs_totais)), 0) as vlr_med,
          max(hrs_totais) as vlr_max,
          case
            when round(stddev(hrs_totais)) is null then 0
            else round(stddev(hrs_totais))
        end as vlr_dp
        from tb_hist_estatistica a
        inner join tb_projetos_atividade b
          on a.id_operacao = b.id_operacao
        where ind_calcular = 1 and not a.hrs_totais = 0
        group by b.id
    ) as calc  
      on calc.id = atividades.id
  where
    atividades.dat_usu_erase is null
    and pocos.dat_usu_erase is null
    and
          sonda.id_pai = 0
  group by
    sonda.id,
    sonda.nom_atividade,
    pocos.nom_atividade,
    pocos.id,
    tcac.id,
    case
      when atividades.nom_atividade is null then tarefas.nom_operacao
      else atividades.nom_atividade
    end,
    atividades.id,
    atividades.dat_ini_plan,
    atividades.dat_fim_plan,
    atividades.dat_ini_real,
    atividades.dat_ini_plan,
    responsaveis.nome_responsavel,
    vlr_min,
    vlr_max,
    vlr_dp,
    vlr_med
  order by
    num_ordem asc,
    atividades.id asc,
    atividades.dat_ini_real asc,
    atividades.id_pai asc;
    `);

    const tratamento = [];

    retorno.forEach((e) => {
      let existe = false;

      const poco = {
        id_poco: e.id_poco,
        poco: e.poco,
        atividades: [],
        total_atv: e.total_atv,
        dat_inicio: e.dat_inicio,
        dat_final: e.dat_final,
        pct_real: e.pct_real_consol,
        dat_alteracao: e.dat_usu_edit,
      };

      const atividade = {
        nome_atividade: e.nome_atividade,
        id_atividade: e.id_atividade,
        custo: e.custo,
        dat_alteracao: e.dat_usu_edit,
        inicio_planejado: e.inicio_planejado,
        fim_planejado: e.fim_planejado,
        hrs_totais: e.hrs_totais,
        hrs_reais: e.hrs_reais,
        inicio_real: e.inicio_real,
        fim_real: e.fim_real,
        pct_plan: e.pct_plan,
        pct_real: e.pct_real,
        nome_responsavel: e.nome_responsavel,
        vlr_min: e.vlr_min,
        vlr_max: e.vlr_max,
        vlr_media: e.vlr_media,
        vlr_dp: e.vlr_dp,
        flag: e.flag,
      };

      tratamento.forEach((t) => {
        if (t.sonda === e.sonda) {
          existe = true;

          let poco_existe = false;

          t.pocos.forEach((inner) => {
            if (inner.poco === e.poco) {
              poco_existe = true;
              if (atividade.id_atividade) inner.atividades.push(atividade);
            }
          });

          if (!poco_existe) {
            if (atividade.id_atividade) poco.atividades.push(atividade);
            t.pocos.push(poco);
          }
        }
      });

      if (!existe) {
        const data = {
          sonda: e.sonda,
          id_sonda: e.id_sonda,
          pocos: [],
        };

        if (atividade.id_atividade) poco.atividades.push(atividade);

        data.pocos.push(poco);

        tratamento.push(data);
      }
    });

    return tratamento;
  }

  async updateProjetosEstatistica(updateEstatistica: EstatisticaDto) {
    const inicio_planejado = await this.trataData(
      updateEstatistica.inicio_planejado,
    );

    const fim_planejado = await this.trataData(updateEstatistica.fim_planejado);

    const inicio_realizado = await this.trataData(
      updateEstatistica.inicio_realizado,
    );

    const fim_realizado = await this.trataData(updateEstatistica.fim_realizado);

    await this.prisma.$queryRawUnsafe(`
      UPDATE tb_projetos_atividade 
      SET
      dat_ini_plan = '${inicio_planejado.toISOString()}',
      dat_fim_plan = '${fim_planejado.toISOString()}',
      dat_ini_real = '${inicio_realizado.toISOString()}',
      dat_fim_real = '${fim_realizado.toISOString()}',
      pct_real = ${updateEstatistica.pct_real}
      WHERE
      id = ${updateEstatistica.id_atividade}
    `);

    const id_ret = await this.prisma.$queryRawUnsafe(`
      SELECT id_projeto FROM tb_projetos_atividade WHERE id = ${updateEstatistica.id_atividade}
    `);

    await this.prisma.$executeRawUnsafe(`
      CALL sp_recalcula_cronograma(${id_ret[0].id_projeto}, ${
      updateEstatistica.id_atividade
    }, '${inicio_realizado.toISOString()}')
    `);
  }

  async trataData(data: string) {
    const retorno = data.split(' ')[0];

    const [day, month, year] = retorno.split('/');

    const data_retorno = new Date(
      `${[year, month, day].join('-')}T${data.split(' ')[1]}`,
    );

    return data_retorno;
  }

  async apagarAtividade(id: number, user: string) {
    // await this.prisma.$queryRawUnsafe(`
    //   UPDATE tb_projetos_atividade set dat_usu_erase = now(), nom_usu_erase = '${user}' WHERE id = ${id}
    // `);
    await this.prisma.$queryRawUnsafe(`
      DELETE FROM tb_projetos_atividade WHERE id = ${id};
    `);
  }
}
