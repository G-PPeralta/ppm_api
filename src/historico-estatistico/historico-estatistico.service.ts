import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { HistoricoEstatisticoDto } from './dto/historico-estatistico.dto';

@Injectable()
export class HistoricoEstatisticoService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.$queryRawUnsafe(`
        SELECT id_projeto, id_sonda, id_poco, id_operacao, hrs_totais, num_profundidade, dat_conclusao, mes, ano, mesano, hrs_npt_man, hrs_npt_rec_ori, hrs_npt_rec_cia, hrs_npt_clima, hrs_npt_inf_tec, hrs_npt_outros, ind_moc, ind_calcular
        FROM tb_hist_estatistica;
    `);
  }

  async create(payload: HistoricoEstatisticoDto) {
    await this.prisma.$queryRawUnsafe(`
    INSERT INTO tb_hist_estatistica
    (id_projeto, id_sonda, id_poco, id_operacao, hrs_totais, num_profundidade, dat_conclusao, mes, ano, mesano, hrs_npt_man, hrs_npt_rec_ori, hrs_npt_rec_cia, hrs_npt_clima, hrs_npt_inf_tec, hrs_npt_outros, ind_moc, ind_calcular)
    VALUES
    (${payload.id_projeto}, ${payload.id_sonda}, ${payload.id_poco}, ${payload.id_operacao}, ${payload.hrs_totais}, ${payload.num_profundidade},
    '${payload.dat_conclusao}', ${payload.mes}, ${payload.ano}, ${payload.mesano}, ${payload.hrs_npt_man}, ${payload.hrs_npt_rec_ori}, 
    ${payload.hrs_npt_rec_cia}, ${payload.hrs_npt_clima}, ${payload.hrs_npt_inf_tec}, ${payload.hrs_npt_outros}, ${payload.ind_moc}, ${payload.ind_calcular});
    `);
  }

  async update(payload: HistoricoEstatisticoDto) {
    await this.prisma.$queryRawUnsafe(`
    UPDATE tb_hist_estatistica
    SET
    id_projeto=${payload.id_projeto},
    id_sonda=${payload.id_sonda},
    id_poco=${payload.id_poco},
    id_operacao=${payload.id_operacao},
    hrs_totais=${payload.hrs_totais},
    num_profundidade=${payload.num_profundidade},
    dat_conclusao='${payload.dat_conclusao}',
    mes=${payload.mes},
    ano=${payload.ano},
    mesano=${payload.mesano},
    hrs_npt_man=${payload.hrs_npt_man},
    hrs_npt_rec_ori=${payload.hrs_npt_rec_ori},
    hrs_npt_rec_cia=${payload.hrs_npt_rec_cia},
    hrs_npt_clima=${payload.hrs_npt_clima},
    hrs_npt_inf_tec=${payload.hrs_npt_inf_tec},
    hrs_npt_outros=${payload.hrs_npt_outros},
    ind_moc=${payload.ind_moc},
    ind_calcular=${payload.ind_calcular};
    WHERE
    id_projeto=${payload.id_projeto} AND
    id_sonda=${payload.id_sonda} AND
    id_poco=${payload.id_poco} AND
    id_operacao=${payload.id_operacao}
    `);
  }
}
