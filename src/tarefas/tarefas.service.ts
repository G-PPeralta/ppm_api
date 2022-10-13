import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateTarefas } from './dto/create-tarefas.dto';

@Injectable()
export class TarefasService {
  constructor(private prisma: PrismaService) {}

  async create(createTarefa: CreateTarefas) {
    const id = await this.prisma.$queryRawUnsafe(`
        INSERT INTO tb_tarefas (nome_tarefa, data_tarefa, atividade_relacionada, descricao_tarefa, responsavel, nom_usu_create, dat_usu_create)
        VALUES ('${createTarefa.nome_tarefa}', '${new Date(
      createTarefa.data_tarefa,
    ).toISOString()}', ${createTarefa.atividade_relacionada}, '${
      createTarefa.descricao_tarefa
    }', '${createTarefa.responsavel}', '${createTarefa.nom_usu_create}', now())
        RETURNING id
    `);
    return id;
  }

  async findAll() {
    return await this.prisma.$queryRawUnsafe(`
    select tarefas.*, atividades.nome_atividade 
    from dev.tb_tarefas tarefas
    inner join dev.tb_atividades atividades
    on atividades.id = tarefas.atividade_relacionada
    `);
  }

  async findOne(id: number) {
    return await this.prisma.$queryRawUnsafe(`
    select tarefas.*, atividades.nome_atividade 
    from tb_tarefas tarefas
    inner join tb_atividades atividades
    on atividades.id = tarefas.atividade_relacionada
    where tarefas.id = ${id}
    `);
  }

  async update(id: number, campo: string, valor: string, user: string) {
    const existe = await this.prisma.$queryRawUnsafe(`
    select CAST(count(*) AS INT) as qt from tb_tarefas where id = ${id}
    `);
    if (existe) {
      await this.prisma.$queryRawUnsafe(`
        UPDATE tb_tarefas SET ${campo} = ${
        !isNaN(+valor) ? valor : "'" + valor + "'"
      },
      nom_usu_edit = '${user}',
      dat_usu_edit = now()
      where id = ${id}`);
    }
  }
}
