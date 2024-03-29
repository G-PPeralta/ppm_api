/**
 *  CRIADO EM: 21/11/2022
 *  AUTOR: Felipe Mateus
 *  DESCRIÇÃO DO ARQUIVO: Manipulação informações pertinestes a feriados
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { Feriado } from './dto/feriado.dto';

@Injectable()
export class FeriadosService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return await this.prisma.$queryRawUnsafe(`
    SELECT
     feriados.id, feriados.ind_global, feriados.id_projeto, feriados.dia_feriado, feriados.mes_feriado, feriados.ano_feriado, feriados.nome_feriado, coalesce(projetos.nome_projeto, '---') as nome_projeto 
     FROM
     tb_feriados feriados
     LEFT JOIN tb_projetos projetos
     on projetos.id = feriados.id_projeto
     where feriados.dat_usu_erase is null
     order by id
    `);
  }

  async getOne(id: number) {
    return await this.prisma.$queryRawUnsafe(`
    SELECT
     feriados.id, feriados.ind_global, feriados.id_projeto, feriados.dia_feriado, feriados.mes_feriado, feriados.ano_feriado, feriados.nome_feriado, coalesce(projetos.nome_projeto, '---') as nome_projeto 
     FROM
     tb_feriados feriados
     LEFT JOIN tb_projetos projetos
     on projetos.id = feriados.id_projeto
    WHERE feriados.id_projeto = ${id}
    and feriados.dat_usu_erase is null
    order by id
   `);
  }

  async create(feriado: Feriado) {
    return await this.prisma.$queryRawUnsafe(`
    INSERT INTO
    tb_feriados
    (ind_global, id_projeto, dia_feriado, mes_feriado, nome_feriado, nom_usu_create, dat_usu_create, ano_feriado)
    VALUES
    (${feriado.ind_global}, ${feriado.id_projeto}, ${feriado.dia_feriado}, ${feriado.mes_feriado}, '${feriado.nome_feriado}', '${feriado.nom_usu_create}', NOW(), ${feriado.ano_feriado})
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
    ind_global = ${feriado.ind_global},
    id_projeto = ${feriado.id_projeto},
    dia_feriado = ${feriado.dia_feriado},
    mes_feriado = ${feriado.mes_feriado},
    ano_feriado = ${feriado.ano_feriado},
    nome_feriado = '${feriado.nome_feriado}'
    WHERE
    id = ${id}
    `);
  }

  async getOneFeriadosTratados(id: number) {
    const retorno: any[] = await this.prisma.$queryRawUnsafe(`
    select nome_feriado, concat(lpad(dia_feriado::text, 2, '0'), '/', lpad(mes_feriado::text, 2, '0'), '/') as data_feriado, coalesce(ano_feriado, (
      select date_part('year', min(atvs.dat_ini_real)) menor_data from tb_projetos_atividade atvs
      inner join tb_projetos proj on
      proj.id = atvs.id_projeto
      where 
      proj.tipo_projeto_id <> 3
      )) as menor_data, coalesce(ano_feriado, (
      select date_part('year', max(atvs.dat_ini_real)) maior_data from tb_projetos_atividade atvs
      inner join tb_projetos proj on
      proj.id = atvs.id_projeto
      where 
      proj.tipo_projeto_id <> 3
      )) as maior_data from tb_feriados  
        where id_projeto = ${id} or ind_global = 1
        and dat_usu_erase is null
        order by id
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

  async getFeriadosTratados() {
    const retorno: any[] = await this.prisma.$queryRawUnsafe(`
    select nome_feriado, concat(lpad(dia_feriado::text, 2, '0'), '/', lpad(mes_feriado::text, 2, '0'), '/') as data_feriado, coalesce(ano_feriado, (
      select date_part('year', min(atvs.dat_ini_real)) menor_data from tb_projetos_atividade atvs
      inner join tb_projetos proj on
      proj.id = atvs.id_projeto
      where 
      proj.tipo_projeto_id <> 3
      )) as menor_data, coalesce(ano_feriado, (
      select date_part('year', max(atvs.dat_ini_real)) maior_data from tb_projetos_atividade atvs
      inner join tb_projetos proj on
      proj.id = atvs.id_projeto
      where 
      proj.tipo_projeto_id <> 3
      )) as maior_data from tb_feriados 
      where dat_usu_erase is null
      order by id
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
