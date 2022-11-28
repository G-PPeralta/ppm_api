import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateProjetosAtividadeDto } from './dto/create-projetos-atividades.dto';
import { CreateProjetosFilhoDto } from './dto/create-projetos-filho.dto';

@Injectable()
export class ProjetosAtividadesService {
  constructor(private prisma: PrismaService) {}

  async createFilho(payload: CreateProjetosFilhoDto) {
    Logger.log(payload);

    /*

    var Dia = 0;
    Dia = Dia*60*60*24

    var Hora = 1;
    Hora = Hora*60*60;

    var Minuto = 30;
    Minuto = Minuto*60

    var Segundos = 0;
    Segundos = Segundos*1;

    unix = new Date().getTime() - ((Dia+Hora+Minuto+Segundos)*1000);
    resultado = new Date(unix);

    */

    const data_inicio = new Date(
      new Date(payload.data_inicio).getTime() - 3 * 60 * 60 * 1000,
    );

    const data_final = new Date(
      new Date(payload.data_fim).getTime() - 3 * 60 * 60 * 1000,
    );

    // Logger.log(data_tratado);
    // const dat_ini = data_tratado.toISOString(); //new Date(vincularAtividade.dat_inicio_plan).toISOString();
    // const data_fim_tratado = addWorkDays(
    //   new Date(dat_ini),
    //   vincularAtividade.duracao_plan + 1, // o front está subtraindo um dia da duração, sabe lá por que...
    // );

    // const dat_fim = new Date(
    //   new Date(data_fim_tratado).getTime() + 9 * 60 * 60 * 1000,
    // );

    // return {
    //   data: dat_ini,
    //   dat_fim: data_fim_tratado,
    //   duracao: vincularAtividade.duracao_plan,
    // };

    // return data_inicio.toISOString();

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

    await this.prisma.$queryRawUnsafe(`
    INSERT INTO tb_projetos_atividade (nom_atividade, pct_real, id_projeto, id_pai, id_operacao, dat_ini_plan, dat_fim_plan, nom_usu_create, dat_usu_create, dat_ini_real, dat_fim_real, profundidade, metodo_elevacao_id)
    VALUES
    ('${operacao[0].nom_operacao}', 0, ${dados_sonda_projeto[0].id}, ${
      payload.id_poco
    }, ${
      payload.operacao_id
    }, '${data_inicio.toISOString()}', '${data_final.toISOString()}', '${
      payload.nom_usu_create
    }', now(), '${data_inicio.toISOString()}}', '${data_final.toISOString()}', ${
      payload.profundidade
    }, ${payload.metodo_elevacao_id})
    `);

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

      Logger.log(`${new Date(atv.data_inicio).toISOString()}`);

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

  async findOne(id: number) {
    return null;
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
    pl.vlr_planejado,
    re.vlr_realizado,
    pa.id_responsavel,
    res.nome_responsavel,
    '' AS fase,
    (select min(dat_ini_plan) from tb_projetos_atividade tpa where id_pai = pa.id ) as dat_ini_plan,
    (select max(dat_fim_plan) from tb_projetos_atividade tpa where id_pai = pa.id ) as dat_fim_plan,
    (select min(dat_ini_real) from tb_projetos_atividade tpa where id_pai = pa.id ) as dat_ini_real,
    (select max(dat_fim_real) from tb_projetos_atividade tpa where id_pai = pa.id ) as dat_fim_real

    FROM tb_projetos_atividade pa
    left JOIN tb_projetos_atividade_custo_plan pl 
      ON pl.id_atividade = pa.id
    LEFT JOIN tb_projetos_atividade_custo_real re	 
      ON re.id_atividade = pa.id
    LEFT JOIN tb_responsaveis res
      ON res.responsavel_id = pa.id_responsavel
    WHERE 
      id_projeto = ${idProjeto}
    and pa.id_pai IS NOT null
    and pa.dat_usu_erase is null
    ;`;

    return await this.prisma.$queryRawUnsafe(query);
  }

  async getCurvaS(idProjeto: string) {
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
}
