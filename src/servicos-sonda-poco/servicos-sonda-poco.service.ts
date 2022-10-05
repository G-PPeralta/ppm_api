import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';

@Injectable()
export class ServicosSondaPocoService {
  constructor(private prisma: PrismaService) {}

  async findSondas() {
    return await this.prisma.$queryRawUnsafe(`
    select a.id, concat(a.id, ' - ', nome_projeto) as nom_sonda
    from tb_projetos a
    inner join tb_projetos_atividade b 
        on a.id = b.id_projeto 
    where 
    b.id_pai = 0
    and a.tipo_projeto_id = 3;`);
  }

  async findPocos(id_projeto: number) {
    return await this.prisma.$queryRawUnsafe(`
    select 
    a.id, concat(a.id, ' - ', nom_atividade) as nom_poco,
    (select 
            --case when min(dat_ini_plan) - INTERVAL '45 DAY' < now() then now() else min(dat_ini_plan) - INTERVAL '45 DAY' end as dat_ini_plan,
        min(dat_ini_plan) as dat_ini_limite
        from tb_projetos_atividade b
        where     
            id_pai = a.id) as dat_ini_limite
    from tb_projetos_atividade a  
    where 
        id_projeto = ${id_projeto}
    and id_operacao is null
    and id_pai <> 0;
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
        select fn_validar_dat_limite_inicio_exec(${id_template}, '${dat_inicio}', '${dat_minima_execucao}') as cod_erro
    `);

    return ret[0];
  }
}
