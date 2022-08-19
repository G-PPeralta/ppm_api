import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { prismaClient } from 'index.prisma';
// import { CreateDetalhamentoDto } from './dto/create-detalhamento.dto';
// import { UpdateDetalhamentoDto } from './dto/update-detalhamento.dto';

@Injectable()
export class DetalhamentoService {
  // create(createDetalhamentoDto: CreateDetalhamentoDto) {
  //   return 'This action adds a new detalhamento';
  // }

  // findAll() {
  //   return `This action returns all detalhamento`;
  // }

  async findOne(id: number) {
    const projeto = await prismaClient.$queryRaw(Prisma.sql`
    select
	    nome_projeto,
	    data_inicio,
	    data_fim,
	    numero,
	    polo,
	    local,
	    demanda,
	    tr.nome_responsavel,
	    tc.coordenador_nome 
    from
	    dev.tb_projetos tp
    left join dev.tb_polos tp2 on
	    tp.polo_id = tp2.id
    left join dev.tb_locais tl on
	    tp.local_id = tl.id
    left join dev.tb_demandas td on
	    tp.demanda_id = td.id
    left join dev.tb_responsaveis tr on
	    tp.responsavel_id = tr.responsavel_id
    left join dev.tb_coordenadores tc on
	    tp.coordenador_id = tc.id_coordenador 
    where tp.id = ${id};
    `);

    return projeto;
  }

  // update(id: number, updateDetalhamentoDto: UpdateDetalhamentoDto) {
  //   return `This action updates a #${id} detalhamento`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} detalhamento`;
  // }
}
