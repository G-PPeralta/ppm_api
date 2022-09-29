import { Injectable, Logger } from '@nestjs/common';
import { CampanhaService } from 'campanha/campanha.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateAtividade } from './dto/create-atividade.dto';

@Injectable()
export class NovaAtividadeService {
  constructor(
    private prisma: PrismaService,
    private campanhaService: CampanhaService,
  ) {}

  async create(createAtividade: CreateAtividade) {
    return await this.prisma
      .$queryRawUnsafe(`INSERT INTO tb_camp_atv (id_origem, nom_atividade, responsavel_id, area_atuacao, nao_iniciar_antes_de, nao_terminar_depois_de, o_mais_breve_possivel)
    VALUES ('${createAtividade.id_origem}', '${
      createAtividade.nom_atividade
    }', ${createAtividade.responsavel_id}, ${createAtividade.area_atuacao}, ${
      createAtividade.nao_iniciar_antes_de.checked === false
        ? null
        : "'" +
          new Date(createAtividade.nao_iniciar_antes_de.data).toISOString() +
          "'"
    }, ${
      createAtividade.nao_terminar_depois_de.checked === false
        ? null
        : "'" +
          new Date(createAtividade.nao_terminar_depois_de.data).toISOString() +
          "'"
    }, ${createAtividade.o_mais_breve_possivel})
    returning ID
`);
  }

  async vinculaIntervencao(
    id_pai: number,
    retorno: number,
    createAtividade: CreateAtividade,
  ) {
    let dias = 0;

    createAtividade.precedentes.forEach((e) => {
      dias += e.dias;
    });

    const lastDate = await this.campanhaService.findDatasPai(id_pai);

    const iniDate = new Date(lastDate[0].dat_ini_prox_intervencao);
    iniDate.setHours(9);
    const data = new Date(iniDate);
    data.setDate(data.getDate() + dias);
    data.setHours(18);

    Logger.log(`
    INSERT INTO tb_camp_atv_campanha (id_pai, dat_ini_plan, dat_fim_plan, nom_usu_create, dat_usu_create, tarefa_id, area_id, responsavel_id)
    VALUES (${id_pai}, '${iniDate.toISOString()}', '${data.toISOString()}', '${
      createAtividade.nom_usu_create
    }', NOW(), ${retorno}, ${createAtividade.area_atuacao}, ${
      createAtividade.responsavel_id
    })
  `);

    return await this.prisma.$queryRawUnsafe(`
      INSERT INTO tb_camp_atv_campanha (id_pai, dat_ini_plan, dat_fim_plan, nom_usu_create, dat_usu_create, tarefa_id, area_id, responsavel_id)
      VALUES (${id_pai}, '${iniDate.toISOString()}', '${data.toISOString()}', '${
      createAtividade.nom_usu_create
    }', NOW(), ${retorno}, ${createAtividade.area_atuacao}, ${
      createAtividade.responsavel_id
    })
    `);
  }

  async findTarefas() {
    return this.prisma.$queryRawUnsafe(`
        SELECT * FROM tb_camp_atv
    `);
  }
}
