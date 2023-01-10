import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { FiltroDto } from './dto/filtros.dto';

@Injectable()
export class FiltrosService {
  constructor(private prisma: PrismaService) {}

  async findProxData(id_poco: number) {
    return await this.prisma.$queryRawUnsafe(`
    select max(dat_ini_real) as prox_ini from tb_projetos_atividade poco
    where id_pai = ${id_poco}
    `);
  }

  async findDuracaoMedia(nome_operacao: string) {
    return await this.prisma.$queryRawUnsafe(`
    select coalesce(round((max(hrs_totais) - min(hrs_totais)) / (ln(max(hrs_totais)) - ln(min(hrs_totais))),0), 0) as duracao_media from tb_hist_estatistica historico
    inner join tb_projetos_operacao operacao
    on operacao.id = historico.id_operacao
    where operacao.nom_operacao like '%${nome_operacao}%'
    `);
  }

  async findSondas() {
    return await this.prisma.$queryRawUnsafe(`
    select a.id_sonda as id, b.nom_sonda as nom_atividade
    from tb_hist_estatistica a
    inner join tb_sondas b
    	on a.id_sonda = b.id
    group by a.id_sonda, b.nom_sonda
    `);
  }

  async findPocos() {
    return await this.prisma.$queryRawUnsafe(`
      select 14 as id, substring(nom_poco, 1, 3) as nom_atividade
      from tb_pocos tp limit 1
    `);
  }

  async findMetodos() {
    return await this.prisma.$queryRawUnsafe(`
    select met.id, met.metodo from tb_hist_estatistica est
    inner join tb_metodo_elevacao met
    on met.id = est.id_metodo_elevacao
    group by met.id, met.metodo
    `);
  }

  async findMedia(filtro: FiltroDto) {
    const query = `
    select 
    id_operacao,
    coalesce(round((max(hrs_totais) - min(hrs_totais)) / (ln(max(hrs_totais)) - ln(min(hrs_totais))),0), 0) as hrs_media
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
        ${filtro.dataDe ? ` AND dat_conclusao >= '${filtro.dataDe}' ` : ``}
        ${filtro.dataAte ? ` AND dat_conclusao <= '${filtro.dataAte}' ` : ``}
        group by id_operacao
    `;
    const resp: any[] = await this.prisma.$queryRawUnsafe(query);

    return resp.map((r) => {
      return {
        id_operacao: r.id_operacao,
        hrs_media: Number(r.hrs_media),
      };
    });
  }

  async getMediaDuracao(filtro: FiltroDto) {
    const query = `
    select 
    coalesce(round((max(hrs_totais) - min(hrs_totais)) / (ln(max(hrs_totais)) - ln(min(hrs_totais))),0), 0) as hrs_media
      from tb_hist_estatistica hist
      inner join tb_pocos tp on hist.id_poco = tp.id
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
      ${filtro.dataDe ? ` AND dat_conclusao >= '${filtro.dataDe}' ` : ``}
      ${filtro.dataAte ? ` AND dat_conclusao <= '${filtro.dataAte}' ` : ``}
      ${filtro.idOperacao ? ` AND id_operacao = ${filtro.idOperacao}` : ``}
      and hist.ind_calcular = 1 and hist.hrs_totais > 0   
      and substring(trim(nom_poco), 1, 3) in (
        select campo from (
        select substring(trim(nom_poco), 1, 3) as campo 
        from tb_pocos tp) as qr
        group by campo
        order by campo asc
        )
    `;
    Logger.log(query);
    const retorno = await this.prisma.$queryRawUnsafe(query);
    return retorno[0].hrs_media;
  }

  async MediaHoraById(id: string) {
    const query = `
    select 
    coalesce(round(sum(log(hrs_totais)),0), 0) as hrs_media
    from tb_hist_estatistica
    where id_operacao = ${id} and ind_calcular = 1 and hrs_totais > 0   
    `;
    const resp = await this.prisma.$queryRawUnsafe(query);
    return resp[0];
  }
}
