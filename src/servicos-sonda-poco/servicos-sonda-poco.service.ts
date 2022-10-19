import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';

@Injectable()
export class ServicosSondaPocoService {
  constructor(private prisma: PrismaService) {}

  async findSondas() {
    return await this.prisma.$queryRawUnsafe(`
    select id, nom_sonda, ordem from (
      select a.id, concat(a.id, ' - ', nome_projeto) as nom_sonda, 1 as ordem
          from tb_projetos a
          inner join tb_projetos_atividade b 
              on a.id = b.id_projeto 
          where 
          b.id_pai = 0
          and a.tipo_projeto_id = 3
      union 
          select 0 as id, concat(0, ' - ', nom_sonda) as nom_sonda, 0 as ordem
          from tb_sondas
          where 
              nom_sonda not in (select nome_projeto from tb_projetos tp where tipo_projeto_id = 3)
      ) as qr
  order by ordem desc;`);
  }

  async findPocos(id_projeto: number) {
    return await this.prisma.$queryRawUnsafe(`
    select id, nom_poco, dat_ini_limite, ordem from (
      select  a.id, concat(a.id, ' - ', nom_atividade) as nom_poco,
          (select 
              --case when min(dat_ini_plan) - INTERVAL '45 DAY' < now() then now() else min(dat_ini_plan) - INTERVAL '45 DAY' end as dat_ini_plan,
              case when min(dat_ini_plan) is null then
                  case when (select max(dat_fim_real) from tb_projetos_atividade where id_projeto = a.id_projeto) is null then
                      now() + interval '15 day'
                  else
                      (select max(dat_fim_real) from tb_projetos_atividade where id_projeto = a.id_projeto)
                  end
              else
                  min(dat_ini_plan)
              end as dat_ini_limite
              from tb_projetos_atividade b
              where     
                  id_pai = a.id) as dat_ini_limite, 1 as ordem
          from tb_projetos_atividade a  
          inner join tb_pocos c
            on a.nom_atividade = c.nom_poco
          where 
              id_projeto = ${id_projeto}
          and id_operacao is null
          and id_pai <> 0
      union 
          select 0 as id, concat(0, ' - ', nom_poco) as nom_poco, 
          case when (select max(dat_fim_real) from tb_projetos_atividade where id_projeto = ${id_projeto}) is null then
              now() + interval '15 day'
          else
              (select max(dat_fim_real) from tb_projetos_atividade where id_projeto = ${id_projeto})
          end as dat_ini_limite, 
          0 as ordem
          from tb_pocos
          where 
              nom_poco not in (select nom_atividade from tb_projetos_atividade where pct_real < 100)
      )as qr
      order by ordem desc, dat_ini_limite asc;
    `);
  }

  async findDatas(id_poco: number) {
    return await this.prisma.$queryRawUnsafe(`
    select 
        case when min(dat_ini_plan) - INTERVAL '45 DAY' < now() then now() else min(dat_ini_plan) - INTERVAL '45 DAY' end as dat_ini_plan
    from tb_projetos_atividade a
    where     
    id_pai = ${id_poco};
    `);
  }

  async verificaErrosCronograma(
    id_template: number,
    dat_inicio: string,
    dat_minima_execucao: string,
  ) {
    const ret = await this.prisma.$queryRawUnsafe(`
        select fn_validar_dat_limite_inicio_exec(${id_template}, '${dat_inicio}', ${
      dat_minima_execucao === 'null' ? null : "'" + dat_minima_execucao + "'"
    }) as cod_erro
    `);

    return ret[0];
  }
}
