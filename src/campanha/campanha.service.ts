import { Injectable, Logger } from '@nestjs/common';
import { addWorkDays } from 'utils/days/daysUtil';
import { PrismaService } from '../services/prisma/prisma.service';
import { CampanhaFiltro } from './dto/campanha-filtro.dto';
import { CreateAtividadeCampanhaDto } from './dto/create-atividade-campanha.dto';
import { CreateCampanhaDto } from './dto/create-campanha.dto';
import { CreateCampanhaFilhoDto } from './dto/create-filho.dto';
import { ReplanejarCampanhaDto } from './dto/replanejar-campanha.dto';
import { TrocarPocoSondaDto } from './dto/trocar-poco-sonda.dto';
import { UpdateCampanhaDto } from './dto/update-campanha.dto';

@Injectable()
export class CampanhaService {
  constructor(private prisma: PrismaService) {}

  async createPai(createCampanhaDto: CreateCampanhaDto) {
    const sonda_id_temp = createCampanhaDto.id_projeto
      .split('-')[0]
      .trimStart()
      .trimEnd();

    const nom_projeto = createCampanhaDto.id_projeto
      .substring(createCampanhaDto.id_projeto.indexOf('-') + 1)
      .trimStart()
      .trimEnd();

    if (Number(sonda_id_temp) === 0 && createCampanhaDto.nova_campanha) {
      await this.prisma.$executeRawUnsafe(`
        call sp_in_criar_cronograma_sonda('${nom_projeto}');
      `);
    }

    const id_projeto = await this.prisma.$queryRawUnsafe(`
      SELECT id FROM tb_projetos_atividade
      WHERE nom_atividade = '${nom_projeto}'
      AND id_pai = 0
    `);

    const ret = await this.prisma.$queryRawUnsafe(`
    select a.id, concat(a.id, ' - ', nome_projeto) as nom_sonda
    from tb_projetos a
    inner join tb_projetos_atividade b 
        on a.id = b.id_projeto 
    where 
    b.id_pai = 0
    and a.tipo_projeto_id = 3
    and a.id = ${id_projeto[0].id}
    union
      select
      a.id, concat(a.id, ' - ', a.nom_atividade)
      from
      tb_projetos_atividade a
      where a.id = ${id_projeto[0].id}
    `);

    const id = await this.prisma.$queryRawUnsafe(`
      insert into tb_campanha (nom_campanha, dsc_comentario, nom_usu_create, id_projeto, dat_usu_create) 
      values 
      (
          '${ret[0].nom_sonda}',
          '${createCampanhaDto.dsc_comentario}',
          '${createCampanhaDto.nom_usu_create}',
          ${id_projeto[0].id},
          now()
      ) returning id
    `);
    return id;
  }

  async createAtividade(
    createAtividadeCampanhaDto: CreateAtividadeCampanhaDto,
  ) {
    const ini = new Date(createAtividadeCampanhaDto.dat_ini_plan);
    const fim = new Date(createAtividadeCampanhaDto.dat_fim_plan);

    const retorno = await this.prisma.$queryRawUnsafe(`
    insert into tb_camp_atv_campanha (id_pai, nom_atividade, pct_real, dat_ini_plan, dat_fim_plan, nom_usu_create, dat_usu_create, id_campanha)
    values (${createAtividadeCampanhaDto.id_pai}, '${
      createAtividadeCampanhaDto.nom_atividade
    }', ${createAtividadeCampanhaDto.pct_real}, ${
      ini == null ? null : "'" + ini.toISOString() + "'"
    }, ${fim == null ? null : "'" + fim.toISOString() + "'"}, '${
      createAtividadeCampanhaDto.nom_usu_create
    }', now(), ${createAtividadeCampanhaDto.id_campanha}) returning id
    `);

    await this.prisma.$queryRawUnsafe(`
      insert into tb_camp_atv_recursos (id_atividade, nom_recurso, nom_usu_create, dat_usu_create, id_area)
      values (${retorno[0].id}, '${createAtividadeCampanhaDto.nom_recurso}', '${createAtividadeCampanhaDto.nom_usu_create}', now(), ${createAtividadeCampanhaDto.id_area})
    `);

    await this.prisma.$queryRawUnsafe(`
      insert into tb_camp_atv_notas (id_atividade, txt_nota, nom_usu_create, dat_usu_create)
      values (${retorno[0].id}, '${createAtividadeCampanhaDto.dsc_comentario}', '${createAtividadeCampanhaDto.nom_usu_create}', now())
    `);

    return retorno;
  }

  async createFilho(createCampanhaDto: CreateCampanhaFilhoDto) {
    let data = new Date(createCampanhaDto.dat_ini_prev);

    const poco_id_temp = createCampanhaDto.poco_id
      .split('-')[0]
      .trimStart()
      .trimEnd();

    const nom_poco = createCampanhaDto.poco_id
      .split('-')[1]
      .trimStart()
      .trimEnd();

    const id_projeto_temp = await this.prisma.$queryRawUnsafe(
      `select nom_campanha from tb_campanha where id = ${createCampanhaDto.id_campanha}`,
    );

    const nom_campanha = id_projeto_temp[0].nom_campanha
      .substring(id_projeto_temp[0].nom_campanha.indexOf('-') + 1)
      .trimStart()
      .trimEnd();

    const id_projeto = await this.prisma.$queryRawUnsafe(`
      SELECT id FROM tb_projetos WHERE nome_projeto = '${nom_campanha}'
    `);

    if (Number(poco_id_temp) === 0 && createCampanhaDto.nova_campanha) {
      await this.prisma.$executeRawUnsafe(
        `call sp_in_criar_cronograma_novo_poco_('${nom_poco}', ${
          id_projeto[0].id
        }, '${new Date(createCampanhaDto.data_limite).toISOString()}');`,
      );
    }

    const poco_id = await this.prisma.$queryRawUnsafe(`
      SELECT 
      id
      FROM tb_projetos_atividade
      WHERE
      id_projeto = ${id_projeto[0].id} and nom_atividade = '${nom_poco}'
    `);

    const id_pai = await this.prisma.$queryRawUnsafe(`
      INSERT INTO tb_camp_atv_campanha (id_pai, poco_id, id_campanha, dat_ini_plan, nom_usu_create, dat_usu_create)
      VALUES (0, ${poco_id[0].id}, ${
      createCampanhaDto.id_campanha
    }, '${new Date(data).toISOString()}', '${
      createCampanhaDto.nom_usu_create
    }', NOW())
      RETURNING ID
    `);

    createCampanhaDto.atividades.forEach(async (atv) => {
      const oldDate = new Date(data);
      data = addWorkDays(data, atv.qtde_dias);
      const id_atv = await this.prisma.$queryRawUnsafe(`
        INSERT INTO tb_camp_atv_campanha (id_pai, tarefa_id, dat_ini_plan, dat_fim_plan, area_id, responsavel_id, ind_atv_execucao)
        VALUES (${id_pai[0].id}, ${atv.tarefa_id}, '${new Date(
        oldDate,
      ).toISOString()}', '${new Date(data).toISOString()}', ${
        atv.area_id
      }, 107, ${atv.ind_atv_execucao ? 1 : 0})
      returning ID
      `);

      atv.precedentes.forEach(async (p) => {
        await this.prisma.$queryRawUnsafe(`
          INSERT INTO tb_camp_atv_campanha (id_pai, tarefa_id)
          VALUES (${id_atv[0].id}, ${p.id})
        `);
      });
    });
  }

  async visaoPrecedentes() {
    let retorno: any[] = [];
    retorno = await this.prisma.$queryRawUnsafe(`
    select
    pai.id as pai_id,
    filhos.id as filhos_id,
      areas.tipo as area,
      tarefas.nome_tarefa as atividade,
      case when  COALESCE(round(fn_atv_calc_pct_real(pai.id),1), 0) < round(fn_atv_calc_pct_plan(
                fn_atv_calcular_hrs(fn_atv_menor_data(pai.id)), -- horas executadas
                fn_hrs_uteis_totais_atv(fn_atv_menor_data(pai.id), fn_atv_maior_data(pai.id)),  -- horas totais
                fn_hrs_uteis_totais_atv(fn_atv_menor_data(pai.id), fn_atv_maior_data(pai.id)) / fn_atv_calc_hrs_totais(pai.id) -- valor ponderado
            )*100,1) then 0 else 1 end as comp_pct,
            filhos.dat_fim_plan as finalplanejado,
            pai.poco_id as id_poco,
        filhos.dat_ini_plan as inicioplanejado,
        0 as qtddias,
        campanha.nom_campanha as sonda,
        tarefas.id as atividadeId,
        round(fn_atv_calc_pct_plan(
                fn_atv_calcular_hrs(fn_atv_menor_data(pai.id)), -- horas executadas
                fn_hrs_uteis_totais_atv(fn_atv_menor_data(pai.id), fn_atv_maior_data(pai.id)),  -- horas totais
                fn_hrs_uteis_totais_atv(fn_atv_menor_data(pai.id), fn_atv_maior_data(pai.id)) / fn_atv_calc_hrs_totais(pai.id) -- valor ponderado
            )*100,1) as pct_plan,
        COALESCE(round(fn_atv_calc_pct_real(pai.id),1), 0) as pct_real
        from tb_camp_atv_campanha filhos
      inner join tb_camp_atv_campanha pai
      on (pai.id_pai = 0 and filhos.id_pai = pai.id)
        inner join
        tb_campanha campanha on campanha.id = pai.id_campanha 
        left join 
        (select 
    a.id, concat(a.id, ' - ', nom_atividade) as nom_poco
    from tb_projetos_atividade a  
    where 
    id_operacao is null
    and id_pai <> 0) poco on poco.id = pai.poco_id
        inner join 
        tb_areas_atuacoes areas on areas.id = filhos.area_id
        inner join
        tb_tarefas tarefas on tarefas.id = filhos.tarefa_id
        order by pai.dat_ini_plan asc`);

    const retornar = async () => {
      const tratamento: any = [];
      for (const e of retorno) {
        const prec = await this.prisma.$queryRawUnsafe(`
            select tarefa_id as precedente_id from
            tb_camp_atv_campanha
            where id_pai = ${e.filhos_id}
            `);

        const dados = {
          area: e.area,
          atividades: [],
        };

        const data = {
          ...e,
          precedentes: prec,
        };

        let existe = false;
        tratamento.forEach((inner) => {
          if (inner.area === e.area) {
            existe = true;
            inner.atividades.push(data);
          }
        });
        if (!existe) {
          dados.atividades.push(data);

          tratamento.push(dados);
        }
      }
      return tratamento;
    };

    return await retornar();
  }

  async findCampanha() {
    return this.prisma.$queryRawUnsafe(`
      SELECT * FROM tb_campanha
    `);
  }

  async findDatas(id: number) {
    return await this.prisma
      .$queryRawUnsafe(`select max(filho.dat_fim_plan) + interval '16' day as dat_ini_prox_intervencao 
    from tb_camp_atv_campanha pai
    inner join tb_camp_atv_campanha filho
    on filho.id_pai = pai.id 
    where pai.id_campanha = ${id} and pai.id_pai = 0`);
  }

  async findDataInicial(id: number) {
    return await this.prisma.$queryRawUnsafe(
      `select dat_ini_plan, dat_fim_plan from tb_camp_atv_campanha tcac where id_pai = ${id} and ind_atv_execucao = 1;`,
    );
  }

  async findDataInicialEstatistica(id: number) {
    const qryTotalAtividades = `select count(*) as total from tb_projetos_atividade tpa where id_pai = ${id};`;
    const respTotalAtv = await this.prisma.$queryRawUnsafe(qryTotalAtividades);

    let query: any;

    if (parseInt(respTotalAtv[0].total) === 0) {
      query = `select dat_ini_plan, dat_fim_plan from tb_camp_atv_campanha tcac where id_pai = (
        select d.id from tb_projetos_atividade a
        inner join tb_projetos b 
          on a.id_projeto = b.id
        inner join tb_campanha c
          on c.id_projeto = b.id
        inner join tb_camp_atv_campanha d 
          on c.id = d.id_campanha 
          and a.id = d.poco_id 
        where a.id = ${id}
      ) and ind_atv_execucao = 1;
      `;
    } else {
      query = `select max(dat_fim_plan) + interval '1 hour' as dat_ini_plan  from tb_projetos_atividade a where id_pai = ${id}`;
    }

    const resp = await this.prisma.$queryRawUnsafe(query);
    return resp[0];
  }

  async findDataFinalPredecessor(id: number) {
    return await this.prisma.$queryRawUnsafe(
      `select dat_ini_plan, dat_fim_plan from tb_camp_atv_campanha tcac where id_pai = ${id} and ind_atv_execucao = 1;`,
    );
  }

  async findDatasPai(id: number) {
    return await this.prisma
      .$queryRawUnsafe(`select max(filho.dat_fim_plan) + interval '16' day as dat_ini_prox_intervencao 
    from tb_camp_atv_campanha pai
    inner join tb_camp_atv_campanha filho
    on filho.id_pai = pai.id 
    where pai.id = ${id} and pai.id_pai = 0`);
  }

  async montaFiltros(campanhaFiltro: CampanhaFiltro): Promise<string> {
    let where = `
    WHERE 
    (
        (
        COALESCE(round(fn_atv_calc_pct_real(pai.id),1), 0) < 100
        )
    ) `;

    if (campanhaFiltro.area_atuacao_id !== null) {
      where += ` AND (select count(area_id) FROM
      tb_camp_atv_campanha filhos
      WHERE filhos.id_pai = pai.id
      AND filhos.area_id = ${campanhaFiltro.area_atuacao_id}
      ) > 0 `;
    }

    if (campanhaFiltro.poco_id !== null) {
      where += ` AND pai.poco_id = ${campanhaFiltro.poco_id} `;
    }

    if (campanhaFiltro.atividade_id !== null) {
      where += ` AND (select count(tarefa_id) FROM
      tb_camp_atv_campanha filhos
      WHERE filhos.id_pai = pai.id
      AND filhos.tarefa_id = ${campanhaFiltro.atividade_id}
      ) > 0 `;
    }

    if (campanhaFiltro.responsavel_id !== null) {
      where += ` AND (select count(responsavel_id) FROM
      tb_camp_atv_campanha filhos
      WHERE filhos.id_pai = pai.id
      AND filhos.responsavel_id = ${campanhaFiltro.responsavel_id}
      ) > 0 `;
    }

    if (campanhaFiltro.data_inicio !== null) {
      where += ` AND pai.dat_ini_plan >= '${new Date(
        campanhaFiltro.data_inicio,
      ).toISOString()}' `;
    }

    if (campanhaFiltro.data_fim !== null) {
      where += ` AND fn_atv_maior_data(pai.id) <= '${new Date(
        campanhaFiltro.data_fim,
      ).toISOString()}' `;
    }

    if (campanhaFiltro.sonda_id !== null) {
      where += ` AND pai.id_campanha = ${campanhaFiltro.sonda_id} `;
    }

    if (campanhaFiltro.status !== null) {
      switch (campanhaFiltro.status) {
        case 1:
          where += ` AND COALESCE(round(fn_atv_calc_pct_real(pai.id),1), 0) = 100
           AND (COALESCE(round(fn_atv_calc_pct_real(pai.id),1), 0)
           >
           round(fn_atv_calc_pct_plan(
            fn_atv_calcular_hrs(fn_atv_menor_data(pai.id)), -- horas executadas
            fn_hrs_uteis_totais_atv(fn_atv_menor_data(pai.id), fn_atv_maior_data(pai.id)),  -- horas totais
            fn_hrs_uteis_totais_atv(fn_atv_menor_data(pai.id), fn_atv_maior_data(pai.id)) / fn_atv_calc_hrs_totais(pai.id) -- valor ponderado
        )*100,1)) `;
          break;
        case 2:
          where += ` AND COALESCE(round(fn_atv_calc_pct_real(pai.id),1), 0) > 0
          AND COALESCE(round(fn_atv_calc_pct_real(pai.id),1), 0) < 100
          AND (COALESCE(round(fn_atv_calc_pct_real(pai.id),1), 0)
           >
           round(fn_atv_calc_pct_plan(
            fn_atv_calcular_hrs(fn_atv_menor_data(pai.id)), -- horas executadas
            fn_hrs_uteis_totais_atv(fn_atv_menor_data(pai.id), fn_atv_maior_data(pai.id)),  -- horas totais
            fn_hrs_uteis_totais_atv(fn_atv_menor_data(pai.id), fn_atv_maior_data(pai.id)) / fn_atv_calc_hrs_totais(pai.id) -- valor ponderado
        )*100,1)) `;
          break;
        case 3:
          where += ` 
          AND (COALESCE(round(fn_atv_calc_pct_real(pai.id),1), 0)
           <
           round(fn_atv_calc_pct_plan(
            fn_atv_calcular_hrs(fn_atv_menor_data(pai.id)), -- horas executadas
            fn_hrs_uteis_totais_atv(fn_atv_menor_data(pai.id), fn_atv_maior_data(pai.id)),  -- horas totais
            fn_hrs_uteis_totais_atv(fn_atv_menor_data(pai.id), fn_atv_maior_data(pai.id)) / fn_atv_calc_hrs_totais(pai.id) -- valor ponderado
        )*100,1)) `;
          break;
        case 4:
          where += ` AND round(fn_atv_calc_pct_plan(
            fn_atv_calcular_hrs(fn_atv_menor_data(pai.id)), -- horas executadas
            fn_hrs_uteis_totais_atv(fn_atv_menor_data(pai.id), fn_atv_maior_data(pai.id)),  -- horas totais
            fn_hrs_uteis_totais_atv(fn_atv_menor_data(pai.id), fn_atv_maior_data(pai.id)) / fn_atv_calc_hrs_totais(pai.id) -- valor ponderado
        )*100,1) = 0 AND COALESCE(round(fn_atv_calc_pct_real(pai.id),1), 0) = 0 `;
          break;
        default:
          where += `
          AND NOT (COALESCE(round(fn_atv_calc_pct_real(pai.id),1), 0) = 100
           AND (COALESCE(round(fn_atv_calc_pct_real(pai.id),1), 0)
           >
           round(fn_atv_calc_pct_plan(
            fn_atv_calcular_hrs(fn_atv_menor_data(pai.id)), -- horas executadas
            fn_hrs_uteis_totais_atv(fn_atv_menor_data(pai.id), fn_atv_maior_data(pai.id)),  -- horas totais
            fn_hrs_uteis_totais_atv(fn_atv_menor_data(pai.id), fn_atv_maior_data(pai.id)) / fn_atv_calc_hrs_totais(pai.id) -- valor ponderado
        )*100,1)))
        AND NOT (COALESCE(round(fn_atv_calc_pct_real(pai.id),1), 0) > 0
        AND COALESCE(round(fn_atv_calc_pct_real(pai.id),1), 0) < 100
        AND (COALESCE(round(fn_atv_calc_pct_real(pai.id),1), 0)
         >
         round(fn_atv_calc_pct_plan(
          fn_atv_calcular_hrs(fn_atv_menor_data(pai.id)), -- horas executadas
          fn_hrs_uteis_totais_atv(fn_atv_menor_data(pai.id), fn_atv_maior_data(pai.id)),  -- horas totais
          fn_hrs_uteis_totais_atv(fn_atv_menor_data(pai.id), fn_atv_maior_data(pai.id)) / fn_atv_calc_hrs_totais(pai.id) -- valor ponderado
      )*100,1)))
      AND NOT ((COALESCE(round(fn_atv_calc_pct_real(pai.id),1), 0)
           <
           round(fn_atv_calc_pct_plan(
            fn_atv_calcular_hrs(fn_atv_menor_data(pai.id)), -- horas executadas
            fn_hrs_uteis_totais_atv(fn_atv_menor_data(pai.id), fn_atv_maior_data(pai.id)),  -- horas totais
            fn_hrs_uteis_totais_atv(fn_atv_menor_data(pai.id), fn_atv_maior_data(pai.id)) / fn_atv_calc_hrs_totais(pai.id) -- valor ponderado
        )*100,1)))
        AND NOT (round(fn_atv_calc_pct_plan(
          fn_atv_calcular_hrs(fn_atv_menor_data(pai.id)), -- horas executadas
          fn_hrs_uteis_totais_atv(fn_atv_menor_data(pai.id), fn_atv_maior_data(pai.id)),  -- horas totais
          fn_hrs_uteis_totais_atv(fn_atv_menor_data(pai.id), fn_atv_maior_data(pai.id)) / fn_atv_calc_hrs_totais(pai.id) -- valor ponderado
      )*100,1) = 0)
          `;
          break;
      }
    }

    return where;
  }

  async findAll(campanhaFiltro: CampanhaFiltro) {
    const where = await this.montaFiltros(campanhaFiltro);

    let retorno: any[] = [];
    retorno = await this.prisma.$queryRawUnsafe(`
    
      select 
        ordem,
        id_campanha,
        id,
        id_poco,
        sonda,
        poco,
        inicioPlanejado_fmt as inicioPlanejado,
        finalPlanejado_fmt as finalPlanejado,
        pct_plan::numeric as pct_plan,
        pct_real::numeric as pct_real,
        ind_alerta,
        case when pct_real = 100 then
          1
        else
          case when pct_real > 0 then
            case when pct_real > pct_plan then
              3
            else
              case when pct_real < pct_plan then
                2
              else
                3
              end
            end
          else 
            case when pct_real < pct_plan then
              2
            else
              4
            end
          end
        end as ind_status
      from (
      select 
        *,
        case when fn_hrs_totais_cronograma_atvv(inicioPlanejado, finalPlanejado) > 0 and fn_hrs_totais_cronograma_atvv(inicioPlanejado, current_date) > 0 then
            case when fn_hrs_totais_cronograma_atvv(inicioPlanejado, current_date) / fn_hrs_totais_cronograma_atvv(inicioPlanejado, finalPlanejado) > 1 then
              100
            else 
              round(fn_hrs_totais_cronograma_atvv(inicioPlanejado, current_date) / fn_hrs_totais_cronograma_atvv(inicioPlanejado, finalPlanejado), 1) * 100
            end
          else
            0
          end as pct_plan
      from (
        select 
            coalesce(ordem ,(select ordem from tb_projetos_atividade where id = pai.poco_id)) as ordem,
          campanha.id as id_campanha,
            pai.id as id,
            pai.poco_id as id_poco,
            coalesce((select case when pct_real > 0 then 1 else 0 end from tb_camp_atv_campanha tcac where id_pai = pai.id and ind_atv_execucao = 1),0) as ind_block,
            (
              select
              concat(p.id, ' - ', p.nome_projeto)
              from tb_projetos p
              where p.nome_projeto = rtrim(ltrim(substring(campanha.nom_campanha from position('-' in campanha.nom_campanha) + 1)))
            ) as sonda,
            coalesce(poco.nom_poco, poco2.poco) as poco,
            (select TO_CHAR(min(dat_ini_plan), 'DD/MM/YYYY') from tb_camp_atv_campanha where id_pai = pai.id and ind_atv_execucao = 1) as inicioPlanejado_fmt,
            (select TO_CHAR(max(dat_fim_plan), 'DD/MM/YYYY') from tb_camp_atv_campanha where id_pai = pai.id and ind_atv_execucao = 1) as finalPlanejado_fmt,
            (select TO_CHAR(min(dat_ini_plan), 'DD/MM/YYYY') from tb_camp_atv_campanha where id_pai = pai.id) as inicioProjPlanejado_fmt,
            TO_CHAR(fn_atv_maior_data(pai.id), 'DD/MM/YYYY') as finalProjPlanejado_fmt,
            (select min(dat_ini_plan) from tb_camp_atv_campanha where id_pai = pai.id and ind_atv_execucao = 1) as inicioPlanejado,
            (select max(dat_fim_plan) from tb_camp_atv_campanha where id_pai = pai.id and ind_atv_execucao = 1) as finalPlanejado,
            (select min(dat_ini_plan) from tb_camp_atv_campanha where id_pai = pai.id) as inicioProjPlanejado,
            fn_atv_maior_data(pai.id) as finalProjPlanejado,
            COALESCE(round(fn_atv_calc_pct_real(pai.id),1), 0) as pct_real,
            case when (select min(dat_ini_plan) from tb_projetos_atividade tpa where id_pai = pai.poco_id group by id_pai) < pai.dat_ini_plan then 
                1
            else 
                0
            end as ind_alerta
            from 
            tb_camp_atv_campanha pai
            right join
            tb_campanha campanha on campanha.id = pai.id_campanha 
            left join 
            (select 
            a.id, concat(a.id, ' - ', nom_atividade) as nom_poco
            from tb_projetos_atividade a  
            where 
            id_operacao is null
            and id_pai <> 0) poco on poco.id = pai.poco_id
            left join tb_intervencoes_pocos poco2
            on poco2.id = pai.poco_id
            ${where}
            order by ordem, (select min(dat_ini_plan) from tb_camp_atv_campanha where id_pai = pai.id) asc
      ) as qr
      ) as qr2
    `);

    const tratamento: any = [];
    retorno.forEach((element) => {
      if (element.pct_real < element.pct_plan) {
        element.comp_pct = 0;
      } else {
        element.comp_pct = 1;
      }

      const data = {
        sonda: element.sonda,
        id_campanha: element.id_campanha,
        pocos: [],
      };

      let existe = false;

      tratamento.forEach((inner) => {
        if (inner.sonda === element.sonda) {
          existe = true;
        }
      });

      if (existe) {
        tratamento.forEach((inner) => {
          if (inner.sonda === element.sonda) {
            const atual = inner.pocos;
            atual.push(element);
            inner.pocos = atual;
          }
        });
      } else {
        data.pocos.push(element);
        tratamento.push(data);
      }
    });

    return tratamento;
  }

  async findOne(id: number) {
    let retorno: any[] = [];
    retorno = await this.prisma.$queryRawUnsafe(`
    --- relacionar as atividades relacionados aos poços
    select 
    id_filho,
    id_atividade,
    hoje,
    inicioplanejado_fmt as inicioplanejado,
    finalplanejado_fmt as finalplanejado,
    qtddias,
    atividade,
    nom_responsavel,
    nom_area,
    sonda,
    comentario,
    pct_plan,
    pct_real,
    id_poco,
    case when pct_real = 100 then
      1
    else
      case when pct_real > 0 then
        case when pct_real > pct_plan then
          3
        else
          case when pct_real < pct_plan then
            2
          else
            3
          end
        end
      else 
        case when pct_real < pct_plan then
          2
        else
          4
        end
      end
    end as ind_status
  from (
    select 
        filho.id as id_filho,
        filho.tarefa_id as id_atividade,
        current_date as hoje,
        fn_hrs_totais_cronograma_atvv(filho.dat_ini_plan, filho.dat_fim_plan) as nm,
        fn_hrs_totais_cronograma_atvv(filho.dat_ini_plan, current_date) as ni,
        filho.dat_ini_plan as inicioplanejado,
        TO_CHAR(filho.dat_ini_plan, 'DD/MM/YYYY')as inicioplanejado_fmt,
        TO_CHAR(filho.dat_fim_plan, 'DD/MM/YYYY')as finalplanejado_fmt,
        filho.dat_fim_plan as finalplanejado,
        filho.dat_ini_real as inicioreal,
        filho.dat_fim_real as fimreal,
        coalesce(round(fn_hrs_uteis_totais_atv(filho.dat_ini_plan, filho.dat_fim_plan)/8,0), 0) as qtddias,
        coalesce(filho.nom_atividade, tarefa.nom_atividade) as atividade,
        responsaveis.nome_responsavel as nom_responsavel,
        area_atuacao.tipo as nom_area,
        campanha.nom_campanha as sonda,
        filho.dsc_comentario as comentario,
        case when fn_hrs_totais_cronograma_atvv(filho.dat_ini_plan, filho.dat_fim_plan) > 0 and fn_hrs_totais_cronograma_atvv(filho.dat_ini_plan, current_date) > 0 then
          case when fn_hrs_totais_cronograma_atvv(filho.dat_ini_plan, current_date) / fn_hrs_totais_cronograma_atvv(filho.dat_ini_plan, filho.dat_fim_plan) > 1 then
            100
          else 
            round(fn_hrs_totais_cronograma_atvv(filho.dat_ini_plan, current_date) / fn_hrs_totais_cronograma_atvv(filho.dat_ini_plan, filho.dat_fim_plan), 1) * 100
          end
        else
          0
        end as pct_plan,
        COALESCE(filho.pct_real, 0) as pct_real,
        pai.id as id_poco
        from tb_camp_atv_campanha pai
        inner join tb_camp_atv_campanha filho
        on filho.id_pai = pai.id 
        inner join tb_camp_atv tarefa
        on tarefa.id = filho.tarefa_id 
        inner join tb_responsaveis responsaveis
        on responsaveis.responsavel_id = filho.responsavel_id
        inner join tb_areas_atuacoes area_atuacao
        on area_atuacao.id = filho.area_id
        inner join tb_campanha campanha
        on campanha.id = pai.id_campanha 
        where pai.id_pai = 0
          and pai.id = ${id}
          and filho.dat_usu_erase is null
          and pai.dat_usu_erase is null
          order by filho.dat_ini_plan asc
    ) as q
    ;
    `);

    retorno.forEach(async (element) => {
      if (element.pct_real < element.pct_plan) {
        element.comp_pct = 0;
      } else {
        element.comp_pct = 1;
      }
    });

    const retornar = async () => {
      const tratamento: any = [];
      for (const e of retorno) {
        const prec = await this.prisma.$queryRawUnsafe(`
            select tarefa_id as precedente_id from
            tb_camp_atv_campanha
            where id_pai = ${e.id_filho}
            `);

        const data = {
          ...e,
          precedentesId: prec,
        };
        tratamento.push(data);
      }
      return tratamento;
    };

    return await retornar();
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

  async trocarPocoSonda(payload: TrocarPocoSondaDto) {
    await this.prisma.$queryRawUnsafe(`
      CALL sp_troca_poco_sonda(${payload.id_campanha_original}, ${payload.id_campanha_destino}, ${payload.id_cronograma_original})
    `);
  }

  async replanejar(payload: ReplanejarCampanhaDto[], id_campanha: number) {
    await payload.reduce(async (prev, cur, curIdx, arr) => {
      if (curIdx < payload.length - 1) {
        const id_anterior = await this.getTbCampanhaFromProjetos(
          arr[await prev].id_cronograma,
          id_campanha,
        );
        const id_posterior = await this.getTbCampanhaFromProjetos(
          arr[curIdx + 1].id_cronograma,
          id_campanha,
        );
        await this.callRecalc(id_anterior, id_posterior, arr[curIdx + 1].ordem);
      }
      return curIdx + 1;
    }, Promise.resolve(0));

    payload.forEach(async (e) => {
      await this.prisma.$queryRawUnsafe(`
        CALL sp_recalcula_cronograma_execucao(${e.id_cronograma}, null);
  `);
    });
  }

  async callRecalc(
    id_poco_anterior: number,
    id_poco_posterior: number,
    ordem: number,
  ) {
    await this.prisma.$queryRawUnsafe(`
      CALL sp_recalcula_campanha(${id_poco_anterior}, ${id_poco_posterior}, ${ordem})
    `);
  }

  async getTbCampanhaFromProjetos(id: number, id_campanha: number) {
    const ret = await this.prisma.$queryRawUnsafe(`
      select id from tb_camp_atv_campanha tcac where poco_id = ${id}
      and id_campanha = ${id_campanha}
    `);

    return ret[0].id;
  }

  async updatePayload(payload: UpdateCampanhaDto) {
    await this.prisma.$queryRawUnsafe(`
      DELETE FROM tb_camp_atv_campanha
      WHERE id_pai = ${payload.atividadeId}
    `);

    payload.precedentes.forEach(async (p) => {
      await this.prisma.$queryRawUnsafe(`
        INSERT INTO tb_camp_atv_campanha (id_pai, tarefa_id)
        VALUES (${payload.atividadeId}, ${p.id})
      `);
    });

    Logger.log(`
    UPDATE tb_camp_atv_campanha
    SET
    pct_real = ${payload.atividadeStatus},
    nom_atividade = '${payload.nome}',
    responsavel_id = ${payload.responsavelId},
    area_id = ${payload.areaId},
    dat_ini_plan = '${new Date(payload.inicioPlanejado).toISOString()}',
    dat_fim_plan = '${new Date(payload.fimPlanejado).toISOString()}',
    dat_ini_real = ${
      payload.inicioReal === null
        ? null
        : "'" + new Date(payload.inicioReal).toISOString() + "'"
    },
    dat_fim_real = ${
      payload.fimReal === null
        ? null
        : "'" + new Date(payload.fimReal).toISOString() + "'"
    },
    dsc_comentario = '${payload.comentario}'
    WHERE
    id = ${payload.atividadeId}
  `);
    return await this.prisma.$queryRawUnsafe(`
      UPDATE tb_camp_atv_campanha
      SET
      pct_real = ${payload.atividadeStatus},
      nom_atividade = '${payload.nome}',
      responsavel_id = ${payload.responsavelId},
      area_id = ${payload.areaId},
      dat_ini_plan = '${new Date(payload.inicioPlanejado).toISOString()}',
      dat_fim_plan = '${new Date(payload.fimPlanejado).toISOString()}',
      dat_ini_real = ${
        payload.inicioReal === null
          ? null
          : "'" + new Date(payload.inicioReal).toISOString() + "'"
      },
      dat_fim_real = ${
        payload.fimReal === null
          ? null
          : "'" + new Date(payload.fimReal).toISOString() + "'"
      },
      dsc_comentario = '${payload.comentario}'
      WHERE
      id = ${payload.atividadeId}
    `);
  }

  async remove(id: number, user: string) {
    return await this.prisma.$queryRawUnsafe(`
    update tb_camp_atv_campanha 
    set
        dat_usu_erase = now(),
        nom_usu_erase = '${user}'
    where
        id = ${id};
    `);
  }
}
