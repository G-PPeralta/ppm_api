import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateAtividadeCampanhaDto } from './dto/create-atividade-campanha.dto';
import { CreateCampanhaDto } from './dto/create-campanha.dto';
import { CreateCampanhaFilhoDto } from './dto/create-filho.dto';

@Injectable()
export class CampanhaService {
  constructor(private prisma: PrismaService) {}

  async createPai(createCampanhaDto: CreateCampanhaDto) {
    const id = await this.prisma.$queryRawUnsafe(`
      insert into tb_campanha (nom_campanha, dsc_comentario, nom_usu_create, dat_usu_create) 
      values 
      (
          '${createCampanhaDto.nom_campanha}',
          '${createCampanhaDto.dsc_comentario}',
          '${createCampanhaDto.nom_usu_create}',
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
    const data = new Date(createCampanhaDto.dat_ini_prev);

    const id_pai = await this.prisma.$queryRawUnsafe(`
      INSERT INTO tb_camp_atv_campanha (id_pai, poco_id, campo_id, id_campanha, dat_ini_plan, nom_usu_create, dat_usu_create)
      VALUES (0, ${createCampanhaDto.poco_id}, ${createCampanhaDto.campo_id}, ${
      createCampanhaDto.id_campanha
    }, '${new Date(data).toISOString()}', '${
      createCampanhaDto.nom_usu_create
    }', NOW())
      RETURNING ID
    `);

    createCampanhaDto.atividades.forEach(async (atv) => {
      const oldDate = new Date(data);
      data.setDate(data.getDate() + atv.qtde_dias);

      await this.prisma.$queryRawUnsafe(`
        INSERT INTO tb_camp_atv_campanha (id_pai, tarefa_id, dat_ini_plan, dat_fim_plan)
        VALUES (${id_pai[0].id}, ${atv.tarefa_id}, '${new Date(
        oldDate,
      ).toISOString()}', '${new Date(data).toISOString()}')
      `);
    });
  }

  async findCampanha() {
    return this.prisma.$queryRawUnsafe(`
      SELECT * FROM tb_campanha
    `);
  }

  async findAll() {
    let retorno: any[] = [];
    retorno = await this.prisma.$queryRawUnsafe(`
    --- relacionar pocos ou intervencoes e campanhas
    select pai.id_campanha as id_campanha,
    pai.id as id_projeto,
    pai.poco_id as id_poco,
    campanha.nom_campanha as sonda,
    poco.poco as poco,
    pai.dat_ini_plan as inicioPlanejado,
    fn_atv_maior_data(pai.id) as finalPlanejado,
    round(fn_atv_calc_pct_plan(
            fn_atv_calcular_hrs(fn_atv_menor_data(pai.id)), -- horas executadas
            fn_hrs_uteis_totais_atv(fn_atv_menor_data(pai.id), fn_atv_maior_data(pai.id)),  -- horas totais
            fn_hrs_uteis_totais_atv(fn_atv_menor_data(pai.id), fn_atv_maior_data(pai.id)) / fn_atv_calc_hrs_totais(pai.id) -- valor ponderado
        )*100,1) as pct_plan,
    COALESCE(round(fn_atv_calc_pct_real(pai.id),1), 0) as pct_real
    from 
    tb_camp_atv_campanha pai
    right join
    tb_campanha campanha on campanha.id = pai.id_campanha 
    inner join 
    tb_intervencoes_pocos poco on poco.id = pai.poco_id 
    where pai.id_pai = 0 and pai.dat_usu_erase is null
;
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
    filho.tarefa_id as id_atividade,
    coalesce(round(fn_hrs_uteis_totais_atv(filho.dat_ini_plan, filho.dat_fim_plan)/8,0), 0) as total,
    tag.nom_tag as nom_atividade,
    responsaveis.nome_responsavel as nom_responsavel,
    area_atuacao.tipo as nom_area,
    pai.id as id_projeto
    from tb_camp_atv_campanha pai
    inner join tb_camp_atv_campanha filho
    on filho.id_pai = pai.id 
    inner join tb_camp_atv tarefa
    on tarefa.id = filho.tarefa_id 
    inner join tb_camp_atv_tag tag
    on tag.id_atividade = tarefa.id
    inner join tb_responsaveis responsaveis
    on responsaveis.responsavel_id = tarefa.responsavel_id
    inner join tb_areas_atuacoes area_atuacao
    on area_atuacao.id = tarefa.area_atuacao
    where pai.id_pai = 0
    and pai.poco_id = ${id};
    `);

    retorno.forEach((element) => {
      if (element.pct_real < element.pct_plan) {
        element.comp_pct = 0;
      } else {
        element.comp_pct = 1;
      }
    });

    return retorno;
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
