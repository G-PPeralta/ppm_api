import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateProjetosAtividadeDto } from './dto/create-projetos-atividades.dto';

@Injectable()
export class ProjetosAtividadesService {
  constructor(private prisma: PrismaService) {}

  async create(createProjetosAtividadesDto: CreateProjetosAtividadeDto) {
    const sonda = await this.prisma.$queryRawUnsafe(
      `SELECT * FROM tb_projetos WHERE id = ${createProjetosAtividadesDto.sonda_id}`,
    );

    const id_pai = await this.prisma.$queryRawUnsafe(
      `INSERT INTO tb_projetos_atividade (id_pai, nom_atividade, pct_real, nom_usu_create, dat_usu_create, id_projeto)
      VALUES (0, '${sonda[0].nome_projeto}', 0, '${createProjetosAtividadesDto.nom_usu_create}', NOW(), ${sonda[0].id})
      RETURNING id`,
    );

    const poco = await this.prisma.$queryRawUnsafe(`
      SELECT * FROM tb_projetos_poco WHERE id = ${createProjetosAtividadesDto.poco_id}
    `);

    const id_pai_poco = await this.prisma.$queryRawUnsafe(`
      INSERT INTO tb_projetos_atividade (id_pai, nom_atividade, pct_real, nom_usu_create, dat_usu_create, id_projeto)
      VALUES (${id_pai[0].id}, '${poco[0].poco}', 0, '${createProjetosAtividadesDto.nom_usu_create}', NOW(), ${sonda[0].id})
      RETURNING id
    `);

    createProjetosAtividadesDto.atividades.forEach(async (atv) => {
      const dataFim = new Date(atv.data_inicio);
      dataFim.setHours(dataFim.getHours() + atv.duracao);

      const id_atv = await this.prisma.$queryRawUnsafe(`
        INSERT INTO tb_projetos_atividade (id_pai, id_operacao, id_area, id_responsavel, dat_ini_plan, dat_fim_plan)
        VALUES (${id_pai_poco[0].id}, ${atv.operacao_id}, ${atv.area_id}, ${
        atv.responsavel_id
      }, '${new Date(
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
    update tb_projetos_atividades 
    set
        dat_usu_erase = now(),
        nom_usu_erase = '${user}'
    where
        id = ${id};
    `);
  }
}
