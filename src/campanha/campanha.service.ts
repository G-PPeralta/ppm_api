import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { CampanhaDto } from './dto/campanha.dto';
import { CreateAtividadeCampanhaDto } from './dto/create-atividade-campanha.dto';
import { CreateCampanhaDto } from './dto/create-campanha.dto';
import { CampanhaFilhoDto } from './dto/create-filho.dto';
import { UpdateCampanhaDto } from './dto/update-campanha.dto';

@Injectable()
export class CampanhaService {
  constructor(private prisma: PrismaService) {}

  async createPai(createCampanhaDto: CreateCampanhaDto) {
    const id = await this.prisma.$queryRawUnsafe(`
      insert into dev.tb_campanha (nom_campanha, dsc_comentario, nom_usu_create, dat_usu_create) 
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
    insert into dev.tb_camp_atv_campanha (id_pai, nom_atividade, pct_real, dat_ini_plan, dat_fim_plan, nom_usu_create, dat_usu_create, id_campanha)
    values (${createAtividadeCampanhaDto.id_pai}, '${
      createAtividadeCampanhaDto.nom_atividade
    }', ${createAtividadeCampanhaDto.pct_real}, ${
      ini == null ? null : "'" + ini.toISOString() + "'"
    }, ${fim == null ? null : "'" + fim.toISOString() + "'"}, '${
      createAtividadeCampanhaDto.nom_usu_create
    }', now(), ${createAtividadeCampanhaDto.id_campanha}) returning id
    `);

    await this.prisma.$queryRawUnsafe(`
      insert into dev.tb_camp_atv_notas (id_atividade, txt_nota, nom_usu_create, dat_usu_create)
      values (${retorno[0].id}, '${createAtividadeCampanhaDto.dsc_comentario}', '${createAtividadeCampanhaDto.nom_usu_create}', now())
    `);

    return retorno;
  }

  async createFilho(createCampanhaDto: CampanhaFilhoDto) {
    const ini = new Date(createCampanhaDto.dat_ini_plan);
    const fim = new Date(createCampanhaDto.dat_fim_plan);

    const id = await this.prisma.$queryRawUnsafe(`
    insert into dev.tb_camp_atv_campanha (id_pai, nom_atividade, pct_real, dat_ini_plan, dat_fim_plan, id_campanha, nom_usu_create, dat_usu_create)
    values
        (
            ${createCampanhaDto.id_pai}, '${
      createCampanhaDto.nom_atividade
    }', ${createCampanhaDto.pct_real}, ${
      ini == null ? null : "'" + ini.toISOString() + "'"
    }, ${fim == null ? null : "'" + fim.toISOString() + "'"}, ${
      createCampanhaDto.id_campanha
    }, '${createCampanhaDto.nom_usu_create}', now()
        );
    `);
    return id;
  }

  async findAll() {
    let retorno: any[] = [];
    retorno = await this.prisma.$queryRawUnsafe(`
    --- relacionar pocos ou intervencoes e campanhas
select 
    b.id as id_campanha,
    a.id as id_poco,
    nom_campanha as sonda,
    nom_atividade as poco,
    dev.fn_atv_menor_data(a.id) as inicioPlanejado,
    dev.fn_atv_maior_data(a.id) as finalPlanejado,
    round(dev.fn_atv_calc_pct_plan(
        dev.fn_atv_calcular_hrs(dev.fn_atv_menor_data(a.id)), -- horas executadas
        dev.fn_hrs_uteis_totais_atv(dev.fn_atv_menor_data(a.id), dev.fn_atv_maior_data(a.id)),  -- horas totais
        dev.fn_hrs_uteis_totais_atv(dev.fn_atv_menor_data(a.id), dev.fn_atv_maior_data(a.id)) / dev.fn_atv_calc_hrs_totais(a.id) -- valor ponderado
    )*100,1) as pct_plan,
    round(dev.fn_atv_calc_pct_real(a.id),1) as pct_real
from dev.tb_camp_atv_campanha a
right join dev.tb_campanha b 
    on a.id_campanha = b.id
where a.id_pai = 0 or a.id_pai is null
and b.dat_usu_erase is null
order by id_campanha asc, inicioPlanejado asc
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
    a.id as id_poco,
    nom_campanha as sonda,
    nom_atividade as atividade,
    round(dev.fn_atv_calc_pct_plan(
        dev.fn_atv_calcular_hrs(dat_ini_plan), -- horas executadas
        dev.fn_hrs_uteis_totais_atv(dat_ini_plan, dat_fim_plan),  -- horas totais
        dev.fn_hrs_uteis_totais_atv(dat_ini_plan, dat_fim_plan) / dev.fn_atv_calc_hrs_totais(id_pai) -- valor ponderado
    )*100,1) as pct_plan,
    pct_real as pct_real,
    dat_ini_plan  as inicioPlanejado,
    dat_fim_plan as finalPlanejado,
    DATE_PART('day', dat_fim_plan) - date_part('day', dat_ini_plan) as qtdDias
from dev.tb_camp_atv_campanha a
right join dev.tb_campanha b 
    on a.id_campanha = b.id
where a.id_pai = ${id}
and a.dat_usu_erase is null
order by dat_ini_plan asc;
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
    select CAST(count(*) AS INT) as qt from dev.tb_camp_atv_campanha where id = ${id} and dat_ini_real is null;
    `);
    if (existe) {
      await this.prisma.$queryRawUnsafe(`
        UPDATE dev.tb_camp_atv_campanha SET ${campo} = ${
        !isNaN(+valor) ? valor : "'" + valor + "'"
      }
      where id = ${id}`);
    }
  }

  async remove(id: number, user: string) {
    return await this.prisma.$queryRawUnsafe(`
    update dev.tb_camp_atv_campanha 
    set
        dat_usu_erase = now(),
        nom_usu_erase = '${user}'
    where
        id = ${id};
    `);
  }
}
