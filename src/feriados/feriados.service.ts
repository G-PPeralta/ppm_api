import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';

@Injectable()
export class FeriadosService {
  constructor(private prisma: PrismaService) {}

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
