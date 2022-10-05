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
    a.id, concat(a.id, ' - ', nom_atividade) as nom_poco
    from tb_projetos_atividade a  
    where 
        id_projeto = ${id_projeto}
    and id_operacao is null
    and id_pai <> 0;
    `);
  }
}
