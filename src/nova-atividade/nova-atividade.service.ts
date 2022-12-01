import { Injectable } from '@nestjs/common';
import { CampanhaService } from 'campanha/campanha.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { addWorkDays } from 'utils/days/daysUtil';
import { CreateAtividade } from './dto/create-atividade.dto';
import { CreateAtividadeOutro } from './dto/create-outros.dto';

@Injectable()
export class NovaAtividadeService {
  constructor(
    private prisma: PrismaService,
    private campanhaService: CampanhaService,
  ) {}

  async createOutros(createOutros: CreateAtividadeOutro) {
    return await this.prisma.$queryRawUnsafe(`
      INSERT INTO tb_camp_atv (nom_atividade, responsavel_id, area_atuacao)
      VALUES
      ('${createOutros.nom_atividade}', 0, 0)
    `);
  }

  async create(createAtividade: CreateAtividade) {
    return await this.prisma
      .$queryRawUnsafe(`INSERT INTO tb_camp_atv (id_origem, nom_atividade, responsavel_id, area_atuacao, fase_id, nom_usu_create)
    VALUES ('${createAtividade.id_origem}', '${createAtividade.nom_atividade}', ${createAtividade.responsavel_id}, ${createAtividade.area_atuacao}, ${createAtividade.fase_id}, '${createAtividade.nom_usu_create}'
    returning ID
`);
  }

  async vinculaIntervencao(
    id_pai: number,
    retorno: number,
    createAtividade: CreateAtividade,
  ) {
    let dias = 0;

    dias += createAtividade.duracao;

    createAtividade.precedentes.forEach((e) => {
      dias += e.dias;
    });

    const lastDate = await this.campanhaService.findDatasPai(id_pai);

    const iniDate = new Date(lastDate[0].dat_ini_prox_intervencao);
    const data = addWorkDays(new Date(iniDate), dias);

    const id_atv = await this.prisma.$queryRawUnsafe(`
      INSERT INTO tb_camp_atv_campanha (id_pai, dat_ini_plan, dat_fim_plan, nom_usu_create, dat_usu_create, tarefa_id, area_id, responsavel_id)
      VALUES (${id_pai}, '${iniDate.toISOString()}', '${data.toISOString()}', '${
      createAtividade.nom_usu_create
    }', NOW(), ${retorno}, ${createAtividade.area_atuacao}, ${
      createAtividade.responsavel_id
    })
    RETURNING id
    `);

    const id_campanha = await this.prisma.$queryRawUnsafe(`
      select topo.id_campanha as id from tb_camp_atv_campanha tcac 
      inner join tb_camp_atv_campanha topo on topo.id = tcac.id_pai
      where tcac.id = ${id_atv[0].id}
    `);

    createAtividade.precedentes.forEach(async (p) => {
      await this.prisma.$queryRawUnsafe(`
        INSERT INTO tb_camp_atv_precedente (id_atividade, id_atv_precedente, id_campanha)
        VALUES (${id_atv[0].id}, ${p.atividadePrecedenteId}, ${id_campanha[0].id})
      `);
    });
  }

  async findTarefas() {
    return this.prisma.$queryRawUnsafe(`
      SELECT distinct on (nom_atividade) * FROM tb_camp_atv
      order by nom_atividade 
    `);
  }
}
