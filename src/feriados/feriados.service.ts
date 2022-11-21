import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { Feriado } from './dto/feriado.dto';

@Injectable()
export class FeriadosService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return await this.prisma.$queryRawUnsafe(`
     SELECT
     id, ind_global, id_projeto, dia_feriado, mes_feriado, nome_feriado
     FROM
     tb_feriados
    `);
  }

  async create(feriado: Feriado) {
    return await this.prisma.$queryRawUnsafe(`
    INSERT INTO
    tb_feriados
    (ind_global, id_projeto, dia_feriado, mes_feriado, nome_feriado, nom_usu_create, dat_usu_create)
    VALUES
    (${feriado.ind_global ? 1 : 0}, ${feriado.id_projeto}, ${
      feriado.dia_feriado
    }, ${feriado.mes_feriado}, '${feriado.nome_feriado}', '${
      feriado.nom_usu_create
    }', NOW())
    `);
  }

  async remove(id: number, nom_usu_erase: string) {
    return await this.prisma.$queryRawUnsafe(`
    UPDATE
    tb_feriados
    SET
    dat_usu_erase = NOW(),
    nom_usu_erase = '${nom_usu_erase}'
    WHERE
    id = ${id}
    `);
  }

  async update(feriado: Feriado, id: number) {
    return await this.prisma.$queryRawUnsafe(`
    UPDATE
    tb_feriados
    SET
    ind_global = ${feriado.ind_global ? 1 : 0},
    id_projeto = ${feriado.id_projeto},
    dia_feriado = ${feriado.dia_feriado},
    mes_feriado = ${feriado.mes_feriado},
    nom_feriado = '${feriado.nome_feriado}'
    WHERE
    id = ${id}
    `);
  }

  async getFeriadosTratados() {
    const retorno: any[] = await this.prisma.$queryRawUnsafe(`
    select nome_feriado, concat(lpad(dia_feriado::text, 2, '0'), '/', lpad(mes_feriado::text, 2, '0'), '/') as data_feriado, (
        select date_part('year', min(atvs.dat_ini_real)) menor_data from tb_projetos_atividade atvs
        inner join tb_projetos proj on
        proj.id = atvs.id_projeto
        where 
        proj.tipo_projeto_id <> 3
        ) as menor_data, (
        select date_part('year', max(atvs.dat_ini_real)) maior_data from tb_projetos_atividade atvs
        inner join tb_projetos proj on
        proj.id = atvs.id_projeto
        where 
        proj.tipo_projeto_id <> 3
        ) as maior_data from tb_feriados 
    `);

    const retornar: any[] = [];

    retorno.forEach((e) => {
      const menor_data: number = e.menor_data;
      const maior_data: number = e.maior_data;

      for (let i = menor_data; i <= maior_data; i++) {
        retornar.push({
          data_feriado: `${e.data_feriado}${i}`,
          nome_feriado: e.nome_feriado,
        });
      }
    });

    return retornar;
  }
}
