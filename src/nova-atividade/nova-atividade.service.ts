import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateAtividade } from './dto/create-atividade.dto';

@Injectable()
export class NovaAtividadeService {
  constructor(private prisma: PrismaService) {}

  async create(createAtividade: CreateAtividade) {
    await this.prisma
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
`);
  }

  async findTarefas() {
    return this.prisma.$queryRawUnsafe(`
        SELECT * FROM tb_camp_atv
    `);
  }
}
