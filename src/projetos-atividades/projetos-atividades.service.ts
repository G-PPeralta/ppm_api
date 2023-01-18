/**
 * CRIADO EM: 18/09/2022
 * AUTOR: GABRIEL PERALTA
 * DESCRIÇÃO: Serviço que cria, lista, atualiza e remove atividades de um projeto. São atividades listadas no gráfico de gantt da tela de detalhamento. Serve também para abastecer o gráfico de curva S e listar operações do módulo de estatística
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateProjetosAtividadeDto } from './dto/create-projetos-atividades.dto';
import { CreateProjetosFilhoDto } from './dto/create-projetos-filho.dto';

@Injectable()
export class ProjetosAtividadesService {
  constructor(private prisma: PrismaService) {}

  async createFilho(payload: CreateProjetosFilhoDto) {
    // Criação de atividades filhas

    const duracao = +payload.duracao;

    // por causa do .toISOString temos que diminuir 3 horas para igualar o fuso horário.
    const data_inicio = new Date(
      new Date(payload.data_inicio).getTime() - 3 * 60 * 60 * 1000,
    );

    const operacao: any[] = await this.prisma.$queryRawUnsafe(`
    SELECT nom_operacao FROM tb_projetos_operacao
    WHERE id = ${payload.operacao_id}
    `);

    const dados_sonda_projeto: any[] = await this.prisma.$queryRawUnsafe(`
    select projetos.* from tb_projetos projetos
    inner join tb_projetos_atividade projetos_atv
    on projetos.id = projetos_atv.id_projeto
    where
    projetos_atv.id = ${payload.id_sonda}
    `);

    if (payload.naoIniciarAntesDe) {
      const dados: any[] = await this.prisma.$queryRawUnsafe(`
        SELECT * FROM tb_projetos_atividade WHERE id_pai = ${payload.id_poco} AND dat_usu_erase is null ORDER BY dat_ini_plan
      `);

      const pos = dados.findIndex((d) => {
        return d.id === payload.naoIniciarAntesDe;
      });

      const newDados = dados.splice(pos);

      if (newDados.length > 1) {
        const inserted = await this.prisma.$queryRawUnsafe(`
        INSERT INTO tb_projetos_atividade (nom_atividade, ordem, pct_real, id_projeto, id_pai, id_operacao, dat_ini_plan, dat_fim_plan, nom_usu_create, dat_usu_create, dat_ini_real, dat_fim_real, profundidade, metodo_elevacao_id)
        VALUES
          (
            '${operacao[0].nom_operacao}',
            ${payload.flag},
            0, 
            ${dados_sonda_projeto[0].id},
            ${payload.id_poco},
            ${payload.operacao_id},
            (select dat_fim_real from tb_projetos_atividade where id = ${payload.naoIniciarAntesDe}),
            (select dat_fim_real from tb_projetos_atividade where id = ${payload.naoIniciarAntesDe}) + interval '1 hour' * ${duracao},
            '${payload.nom_usu_create}',
            now(),
            (select dat_fim_real from tb_projetos_atividade where id = ${payload.naoIniciarAntesDe}),
            (select dat_fim_real from tb_projetos_atividade where id = ${payload.naoIniciarAntesDe}) + interval '1 hour' * ${duracao},
            0,
            ${payload.metodo_elevacao_id}
          )
          RETURNING *
        `);

        for (let i = 1; i < newDados.length; i++) {
          if (i === 1) {
            await this.prisma.$queryRawUnsafe(`
                UPDATE tb_projetos_atividade 
                SET 
                dat_ini_plan = to_timestamp(${
                  +inserted[0].dat_fim_plan / 1000
                }),
                dat_ini_real = to_timestamp(${
                  +inserted[0].dat_fim_plan / 1000
                }),
                dat_fim_plan = (to_timestamp(${
                  +inserted[0].dat_fim_plan / 1000
                }) + interval '1 hour' * ${duracao}) + interval '1 hour' * (extract(EPOCH from dat_fim_plan - dat_ini_plan)/3600),
                dat_fim_real = (to_timestamp(${
                  +inserted[0].dat_fim_plan / 1000
                }) + interval '1 hour' * ${duracao}) + interval '1 hour' * (extract(EPOCH from dat_fim_real - dat_ini_real)/3600)
                WHERE
                id = ${newDados[i].id}
              `);
          } else {
            const dadosAnteriores = await this.prisma.$queryRawUnsafe(`
                SELECT *, (extract(EPOCH from dat_fim_plan - dat_ini_plan)/3600) as dur_plan, (extract(EPOCH from dat_fim_real - dat_ini_real)/3600) as dur_real FROM tb_projetos_atividade WHERE id = ${
                  newDados[i - 1].id
                } AND dat_usu_erase is null
              `);

            await this.prisma.$queryRawUnsafe(`
                UPDATE tb_projetos_atividade 
                SET 
                dat_ini_plan = to_timestamp(${
                  +dadosAnteriores[0].dat_fim_plan / 1000
                }),
                dat_ini_real = to_timestamp(${
                  +dadosAnteriores[0].dat_fim_real / 1000
                }),
                dat_fim_plan = (to_timestamp(${
                  +dadosAnteriores[0].dat_fim_plan / 1000
                }) + interval '1 hour' * ${
              dadosAnteriores[0].dur_plan
            }) + interval '1 hour' * (extract(EPOCH from dat_fim_plan - dat_ini_plan)/3600),
                dat_fim_real = (to_timestamp(${
                  +dadosAnteriores[0].dat_fim_real / 1000
                }) + interval '1 hour' * ${
              dadosAnteriores[0].dur_real
            }) + interval '1 hour' * (extract(EPOCH from dat_fim_real - dat_ini_real)/3600)
                WHERE
                id = ${newDados[i].id}
              `);
          }

          await this.prisma.$queryRawUnsafe(`
              call sp_up_atualiza_datas_cip10(${payload.id_poco})
            `);

          await this.prisma.$queryRawUnsafe(`
              call sp_up_cascateia_cron_campanha(${payload.id_poco})
            `);
        }
      } else {
        await this.prisma.$queryRawUnsafe(
          `
              call sp_in_create_atv_intervencao(
                '${operacao[0].nom_operacao}',
                ${payload.flag},
                ${dados_sonda_projeto[0].id},
                ${payload.id_poco},
                ${payload.operacao_id},
                ${+data_inicio / 1000},
                '${payload.nom_usu_create}',
                ${payload.metodo_elevacao_id},
                ${duracao}
              )`,
        );
      }
    } else {
      await this.prisma.$queryRawUnsafe(
        `
        call sp_in_create_atv_intervencao(
          '${operacao[0].nom_operacao}',
          ${payload.flag},
          ${dados_sonda_projeto[0].id},
          ${payload.id_poco},
          ${payload.operacao_id},
          ${+data_inicio / 1000},
          '${payload.nom_usu_create}',
          ${payload.metodo_elevacao_id},
          ${duracao}
        )`,
      );
    }

    return { gravado: 1 };
  }

  async create(createProjetosAtividadesDto: CreateProjetosAtividadeDto) {
    const sonda: any[] = await this.prisma.$queryRawUnsafe(
      `SELECT * FROM tb_sondas WHERE id = ${createProjetosAtividadesDto.sonda_id}`,
    );

    const dados_sonda_projeto: any[] = await this.prisma.$queryRawUnsafe(`
    select tb_projetos.* from tb_sondas
    inner join tb_projetos
    on tb_projetos.nome_projeto = tb_sondas.nom_sonda
    and tb_sondas.id = ${createProjetosAtividadesDto.sonda_id}
    `);

    let existe = false;
    if (dados_sonda_projeto.length > 0) {
      const sonda_existe = await this.prisma.$queryRawUnsafe(
        `SELECT count(1) as existe FROM tb_projetos_atividade WHERE 
        id_projeto = ${dados_sonda_projeto[0].id} and id_pai = 0`,
      );
      existe = sonda_existe[0].existe > 0;
    }

    let id_projeto;
    let id_pai;
    if (!existe) {
      const ret = await this.prisma.$queryRawUnsafe(`
      INSERT INTO tb_projetos
      (nome_projeto, polo_id, local_id, tipo_projeto_id, status_id)
      VALUES('${sonda[0].nom_sonda}', 1, 4, 3, 1)
      RETURNING id
      `);
      id_projeto = ret[0].id;

      id_pai = await this.prisma.$queryRawUnsafe(
        `INSERT INTO tb_projetos_atividade (id_pai, nom_atividade, pct_real, nom_usu_create, dat_usu_create, id_projeto)
        VALUES (0, '${sonda[0].nom_sonda}', 0, '${createProjetosAtividadesDto.nom_usu_create}', NOW(), ${id_projeto})
        RETURNING id`,
      );
    } else {
      id_projeto = dados_sonda_projeto[0].id;
      id_pai = await this.prisma.$queryRawUnsafe(`
        SELECT id FROM tb_projetos_atividade WHERE id_projeto = ${id_projeto} and id_pai = 0
      `);
    }

    const poco = await this.prisma.$queryRawUnsafe(`
    SELECT * FROM tb_intervencoes_pocos WHERE id = ${createProjetosAtividadesDto.poco_id}
  `);

    const poco_existe = await this.prisma.$queryRawUnsafe(`
      SELECT count(1) as existe FROM tb_projetos_atividade WHERE id_projeto = ${id_projeto} and id_pai = ${id_pai[0].id}
      and nom_atividade = '${poco[0].poco}'
    `);

    let id_pai_poco;
    if (poco_existe[0].existe > 0) {
      id_pai_poco = await this.prisma.$queryRawUnsafe(`
        SELECT id FROM tb_projetos_atividade where id_projeto = ${id_projeto} and id_pai = ${id_pai[0].id}
      `);
    } else {
      id_pai_poco = await this.prisma.$queryRawUnsafe(`
      INSERT INTO tb_projetos_atividade (id_pai, nom_atividade, pct_real, nom_usu_create, dat_usu_create, id_projeto)
      VALUES (${id_pai[0].id}, '${poco[0].poco}', 0, '${createProjetosAtividadesDto.nom_usu_create}', NOW(), ${id_projeto})
      RETURNING id
    `);
    }

    createProjetosAtividadesDto.atividades.forEach(async (atv) => {
      const dataFim = new Date(atv.data_inicio);
      dataFim.setHours(dataFim.getHours() + atv.duracao);

      const operacao = await this.prisma.$queryRawUnsafe(`
        SELECT * FROM tb_projetos_operacao WHERE id = ${atv.operacao_id}
      `);

      const id_atv = await this.prisma.$queryRawUnsafe(`
        INSERT INTO tb_projetos_atividade (nom_atividade, pct_real, id_projeto, id_pai, id_operacao, id_area, id_responsavel, dat_ini_plan, dat_fim_plan, nom_usu_create, dat_usu_create, dat_ini_real, dat_fim_real)
        VALUES ('${operacao[0].nom_operacao}', 0, ${id_projeto}, ${
        id_pai_poco[0].id
      }, ${atv.operacao_id}, ${atv.area_id}, ${atv.responsavel_id}, '${new Date(
        atv.data_inicio,
      ).toISOString()}', '${dataFim.toISOString()}', '${
        createProjetosAtividadesDto.nom_usu_create
      }', NOW(), '${new Date(
        atv.data_inicio,
      ).toISOString()}', '${dataFim.toISOString()}')
      RETURNING ID
      `);

      atv.precedentes.forEach(async (p) => {
        await this.prisma.$queryRawUnsafe(`
        INSERT INTO tb_projetos_atividade (id_pai, id_operacao)
        VALUES (${id_atv[0].id}, ${p.id})
      `);
      });
    });
  }

  async findOperacoes() {
    // retorna todas as operações, encontradas no módulo de estatística
    return await this.prisma.$queryRawUnsafe(`
    SELECT * FROM tb_projetos_operacao
    `);
  }

  async findAll() {
    return await this.prisma.$queryRawUnsafe(`
    select 
    *,
    round(fn_atv_calc_pct_plan(
        fn_atv_calcular_hrs(dat_ini_plan), -- horas executadas
        fn_hrs_uteis_totais_atv(dat_ini_plan, dat_fim_plan),  -- horas totais
        fn_hrs_uteis_totais_atv(dat_ini_plan, dat_fim_plan) / fn_atv_calc_hrs_totais(id_pai) -- valor ponderado
    )*100,1) as pct_plan
from tb_projetos a
left join tb_projetos_atividade b 
    on a.id = b.id_projeto 
where 
    b.id_pai = 0 or b.id_pai is null;
    `);
  }

  async update(id: number, campo: string, valor: string) {
    const existe = await this.prisma.$queryRawUnsafe(`
    select CAST(count(*) AS INT) as qt from tb_projetos_atividades where id = ${id} and dat_ini_real is null;
    `);
    if (existe) {
      const idPai = await this.prisma.$queryRawUnsafe(`
        UPDATE tb_projetos_atividades SET ${campo} = ${
        !isNaN(+valor) ? valor : "'" + valor + "'"
      }
      where id = ${id} returning id_pai`);

      await this.prisma.$queryRawUnsafe(`
      call sp_cron_atv_update_datas_pcts_pais(${idPai});
      `);
    }
  }

  async remove(id: number, user: string) {
    return await this.prisma.$queryRawUnsafe(`
    update tb_projetos_atividade
    set
        dat_usu_erase = now(),
        nom_usu_erase = '${user}'
    where
        id = ${id};
    `);
  }

  async getAtividaesProjetos(idProjeto: string) {
    const query = `
    SELECT 
    pa.id,
    pa.nom_atividade,
    (
      select case when sum(tcc.valor) is null then 0 else sum(tcc.valor) end from tb_centro_custo tcc where tcc.projeto_id = tp.id and tcc.dat_usu_erase is null
    ) as vlr_realizado,
    tp.responsavel_id as id_responsavel,
    res.nome_responsavel,
    '' AS fase,
    (select min(dat_ini_plan) from tb_projetos_atividade tpa where id_pai = pa.id ) as dat_ini_plan,
    (select max(dat_fim_plan) from tb_projetos_atividade tpa where id_pai = pa.id ) as dat_fim_plan,
    (select min(dat_ini_real) from tb_projetos_atividade tpa where id_pai = pa.id ) as dat_ini_real,
    (select max(dat_fim_real) from tb_projetos_atividade tpa where id_pai = pa.id ) as dat_fim_real,
    coalesce(fn_cron_calc_pct_real_regra_aprovada(pa.id_projeto), 0) as pct_real,
    coalesce(fn_cron_calc_pct_plan_aprovada(pa.id_projeto), 0) as pct_plan,
    tp.valor_total_previsto as vlr_planejado
    FROM tb_projetos_atividade pa
    inner join tb_projetos tp 
      ON tp.id = pa.id_projeto
    left JOIN tb_projetos_atividade_custo_plan pl 
      ON pl.id_atividade = pa.id
    LEFT JOIN tb_projetos_atividade_custo_real re	 
      ON re.id_atividade = pa.id
    LEFT JOIN tb_responsaveis res
      ON res.responsavel_id = tp.responsavel_id
    WHERE 
      id_projeto = ${idProjeto}
    and pa.id_pai IS NOT null
    and pa.dat_usu_erase is null
    ;`;

    const retorno: any[] = await this.prisma.$queryRawUnsafe(query);

    return retorno.map((e) => ({
      ...e,
      name: e.nom_atividade,
      responsible: e.nome_responsavel,
      startDate: e.dat_ini_plan,
      endDate: e.dat_fim_plan,
      budget: e.vlr_planejado,
      realized: e.vlr_realizado,
      percent: e.pct_real,
    }));
  }

  async getCurvaS(idProjeto: string) {
    // abastece o gráfico da curva S, do detalhamento de um projeto
    const query = `
    SELECT         
    id_projeto,
    mesano,
    hrs_totais,
    acum_plan,
    pct_plan,
    pct_real,
    pct_capex_plan,
    pct_capex_real
    from tb_projeto_curva_s
    WHERE id_projeto = ${idProjeto};`;

    return await this.prisma.$queryRawUnsafe(query);
  }

  async findDataFinalPredecessor(id: number) {
    return await this.prisma.$queryRawUnsafe(
      `  select dat_fim_plan from tb_projetos_atividade tpa where id = ${id};`,
    );
  }

  async updateProfundidade(id_pai: number, profundidade: number) {
    return await this.prisma.$queryRawUnsafe(
      `update tb_projetos_atividade 
      set
          profundidade = '${profundidade}'
      where 
          id_pai = '${id_pai}'`,
    );
  }

  async getProfundidadeById(id: number) {
    const retorno = await this.prisma.$queryRawUnsafe(`
      SELECT profundidade FROM tb_projetos_atividade WHERE id_pai = ${id} GROUP BY profundidade
    `);
    return retorno;
  }
}
