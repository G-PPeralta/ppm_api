import { Injectable, Logger } from '@nestjs/common';
import { IntervencoesService } from 'intervencoes/intervencoes.service';

@Injectable()
export class EstatisticasIntervencoesService {
  constructor(private readonly intervencoesService: IntervencoesService) {}

  async percentCardAtiv(id: string) {
    const intervencao = await this.intervencoesService.findOneByAtividade(+id);
    let real = 0;
    let planejado = 0;
    const retorno: any = {};

    if (intervencao) {
      const diasTotais = Math.ceil(
        Math.abs(
          intervencao.inicioPlanejado.getTime() -
            intervencao.fimPlanejado.getTime(),
        ) /
          (1000 * 3600 * 24),
      );
      const diasCorridos = Math.ceil(
        Math.abs(intervencao.inicioPlanejado.getTime() - new Date().getTime()) /
          (1000 * 3600 * 24),
      );

      if (diasCorridos / diasTotais < 0) {
        real = 0;
      } else {
        if (diasCorridos / diasTotais > 1) {
          real = 1;
        } else {
          real = diasCorridos / diasTotais;
        }
      }

      planejado = diasCorridos / diasTotais;

      retorno.intervencao = intervencao;
      retorno.estatistica = { real, planejado };
    }
    return retorno;
  }

  async percentCardPoco(id: string) {
    const intervencao = await this.intervencoesService.findByAtividade(+id);

    let diasTotais;
    let retorno;

    intervencao.forEach(async (elemento) => {
      diasTotais =
        diasTotais +
        Math.ceil(
          Math.abs(
            elemento.inicioPlanejado.getTime() -
              elemento.fimPlanejado.getTime(),
          ) /
            (1000 * 3600 * 24),
        );

      const retornoAtiv = await this.percentCardAtiv(id);

      Logger.log(retornoAtiv);
    });
  }
}
