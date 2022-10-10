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
    case when atividades.nom_atividade is null then tarefas.nom_operacao else atividades.nom_atividade end as nome_atividade,
    atividades.id as id_atividade, --verificar se é id da atividade ou da origem
    0.00 as custo,
    atividades.dat_ini_plan as inicio_planejado,
    atividades.dat_fim_plan as fim_planejado,
    fn_hrs_totais_cronograma_atvv(atividades.dat_ini_plan, atividades.dat_fim_plan) as hrs_totais,
    case when fn_hrs_totais_cronograma_atvv(atividades.dat_ini_real, atividades.dat_fim_real) is null then 0 else fn_hrs_totais_cronograma_atvv(atividades.dat_ini_real, atividades.dat_fim_real) end as hrs_reais,
    atividades.dat_ini_real as inicio_real,
    atividades.dat_fim_real as fim_real,
    round(fn_atv_calc_pct_plan(
            fn_atv_calcular_hrs(atividades.dat_ini_plan), -- horas executadas
            fn_hrs_uteis_totais_atv(atividades.dat_ini_plan, atividades.dat_fim_plan),  -- horas totais
            fn_hrs_uteis_totais_atv(atividades.dat_ini_plan, atividades.dat_fim_plan) / fn_atv_calc_hrs_totais_projetos(pocos.id) -- valor ponderado
        )*100,1) as pct_plan,
        coalesce(atividades.pct_real, 0) as pct_real,
        responsaveis.nome_responsavel as nome_responsavel,
        0 as vlr_min,
        0 as vlr_max,
        0 as vlr_media,
        0 as vlr_dp
    from
    tb_projetos_atividade sonda
    inner join tb_projetos_atividade pocos
    on pocos.id_pai = sonda.id
    inner join tb_projetos_atividade atividades
    on (atividades.id_pai = pocos.id)
    left join tb_projetos_operacao tarefas
    on (tarefas.id = atividades.id_operacao)
    left join tb_responsaveis responsaveis
    on responsaveis.responsavel_id = atividades.id_responsavel
    where
    sonda.id_pai = 0
    group by 
    sonda.id, sonda.nom_atividade, pocos.nom_atividade, pocos.id,
    case when atividades.nom_atividade is null then tarefas.nom_operacao else atividades.nom_atividade end,
    atividades.id, atividades.dat_ini_plan, atividades.dat_fim_plan, atividades.dat_ini_real, atividades.dat_ini_plan,
    responsaveis.nome_responsavel
    order by atividades.id_pai asc, atividades.dat_ini_plan asc
    `);

    const tratamento = [];

    retorno.forEach((e) => {
      let existe = false;

      const poco = {
        id_poco: e.id_poco,
        poco: e.poco,
        atividades: [],
      };

      const atividade = {
        nome_atividade: e.nome_atividade,
        id_atividade: e.id_atividade,
        custo: e.custo,
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
      };

      tratamento.forEach((t) => {
        if (t.sonda === e.sonda) {
          existe = true;

          let poco_existe = false;

          t.pocos.forEach((inner) => {
            if (inner.poco === e.poco) {
              poco_existe = true;
              inner.atividades.push(atividade);
            }
          });

          if (!poco_existe) {
            poco.atividades.push(atividade);
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

        poco.atividades.push(atividade);

        data.pocos.push(poco);

        tratamento.push(data);
      }
    });

    return tratamento;
  }

  async updateProjetosEstatistica(updateEstatistica: EstatisticaDto) {
    await this.prisma.$queryRawUnsafe(`
      UPDATE tb_projetos_atividade 
      SET
      pct_real = ${updateEstatistica.pct_real},
      dat_ini_plan = '${new Date(
        updateEstatistica.inicio_planejado,
      ).toISOString()}',
      dat_fim_plan = '${new Date(
        updateEstatistica.fim_planejado,
      ).toISOString()}',
      dat_ini_real = '${new Date(
        updateEstatistica.inicio_realizado,
      ).toISOString()}',
      dat_fim_real = '${new Date(
        updateEstatistica.fim_realizado,
      ).toISOString()}',
      id_area = ${updateEstatistica.id_area},
      id_responsavel = ${updateEstatistica.id_responsavel}
      WHERE
      id = ${updateEstatistica.id_atividade}
    `);
  }

  async vincularAtividade(createAtividade: CreateEstatisticaDto) {
    const atv: any[] = await this.prisma.$queryRawUnsafe(`
      SELECT nom_operacao FROM tb_projetos_operacao
      WHERE id = ${createAtividade.id_atividade}
    `);

    const projeto: any[] = await this.prisma.$queryRawUnsafe(`
      SELECT * FROM tb_projetos_atividade WHERE id = ${createAtividade.id_sonda}
    `);

    const dataFimPlanejado = new Date(createAtividade.inicio_planejado);
    dataFimPlanejado.setHours(
      dataFimPlanejado.getHours() + createAtividade.duracao_planejado,
    );

    const dataFimRealizado = new Date(createAtividade.inicio_realizado);
    dataFimRealizado.setHours(
      dataFimRealizado.getHours() + createAtividade.duracao_realizado,
    );

    await this.prisma.$queryRawUnsafe(`
      INSERT INTO tb_projetos_atividade
      (id_pai, nom_atividade, pct_real, dat_ini_plan, dat_fim_plan, dat_ini_real, dat_fim_real, id_projeto, id_operacao, id_area, id_responsavel)
      VALUES
      (${createAtividade.id_poco}, ${atv[0].nom_operacao}, 0, '${new Date(
      createAtividade.inicio_planejado,
    ).toISOString()}', '${dataFimPlanejado.toISOString()}', '${new Date(
      createAtividade.inicio_realizado,
    ).toISOString()}', '${dataFimRealizado.toISOString()}', ${
      projeto[0].id_projeto
    }, ${createAtividade.id_atividade}, ${createAtividade.id_area}, ${
      createAtividade.id_responsavel
    })
    `);
  }
}
