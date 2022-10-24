import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { FiltroDto } from './dto/filtros.dto';

@Injectable()
export class FiltrosService {
  constructor(private prisma: PrismaService) {}

  async findMedia(filtro: FiltroDto) {
    return this.prisma.$queryRawUnsafe(`
    select 
    id_operacao,
    round(avg(hrs_totais),0) as hrs_media
    from tb_hist_estatistica
    where 1=1
        ${filtro.pocoId > 0 ? ` AND id_poco = ${filtro.pocoId} ` : ``}
        ${
          filtro.profundidadeIni > 0
            ? ` AND num_profundidade >= ${filtro.profundidadeIni} `
            : ``
        }
        ${
          filtro.profundidadeFim > 0
            ? ` AND num_profundidade <= ${filtro.profundidadeFim} `
            : ``
        }
        ${filtro.sondaId > 0 ? ` AND id_sonda = ${filtro.sondaId} ` : ``}
        ${
          filtro.dataDe.length > 0
            ? ` AND dat_conclusao >= ${filtro.dataDe} `
            : ``
        }
        ${
          filtro.dataDe.length > 0
            ? ` AND dat_conclusao <= ${filtro.dataDe} `
            : ``
        }
        group by id_operacao
    `);
  }
}
