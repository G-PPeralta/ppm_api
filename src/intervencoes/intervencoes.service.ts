import { Injectable } from '@nestjs/common';
import { ProjetoIntervencaoService } from 'projeto-intervencao/projeto-intervencao.service';
import { CreateIntervencaoDto } from './dto/create-intervencao.dto';
import { IntervencaoRepository } from './repositories/intervencoes.repository';
// import { UpdateIntervencoeDto } from './dto/update-intervencao.dto';

@Injectable()
export class IntervencoesService {
  constructor(
    private repo: IntervencaoRepository,
    private projetoIntervencaoService: ProjetoIntervencaoService,
  ) {}

  async create(createIntervencoeDto: CreateIntervencaoDto) {
    const intervencao = {
      inicioPlanejado: createIntervencoeDto.inicioPlanejado,
      fimPlanejado: createIntervencoeDto.fimPlanejado,
      observacoes: createIntervencoeDto.observacoes,
      nome: createIntervencoeDto.nome,
      tipoProjetoId: createIntervencoeDto.tipoProjetoId,
      campoId: null,
      sptId: createIntervencoeDto.sptId,
      pocoId: createIntervencoeDto.pocoId,
    };
    const saveIntervencao = await this.repo.saveResponsabilidade(
      intervencao,
      createIntervencoeDto,
    );

    return saveIntervencao;
  }

  findAll() {
    return this.repo.intervencoesList();
  }

  findByAtividade(id: number) {
    return this.repo.findByAtividade(id);
  }

  findOneByAtividade(id: number) {
    return this.repo.findOneByAtividade(id);
  }

  /*findOne(id: number) {
    return `This action returns a #${id} intervencoe`;
  }

  update(id: number, updateIntervencoeDto: UpdateIntervencoeDto) {
    return `This action updates a #${id} intervencoe`;
  }

  remove(id: number) {
    return `This action removes a #${id} intervencoe`;
  }*/
}
