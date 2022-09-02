import { Injectable } from '@nestjs/common';
import { CreateAtividadesIntervencoeDto } from './dto/create-atividades-intervencao.dto';
import { UpdateAtividadesIntervencoeDto } from './dto/update-atividades-intervencao.dto';
import { AtividadesIntervencaoEntity } from './entities/atividades-intervencao.entity';
import { AtividadeIntervencaoRepository } from './repository/atividades-invervencoes.repository';

@Injectable()
export class AtividadesIntervencoesService {
  constructor(private readonly repo: AtividadeIntervencaoRepository) {}
  async create(
    _createAtividadesIntervencoeDto: CreateAtividadesIntervencoeDto,
  ) {
    const dataAtividade: AtividadesIntervencaoEntity = {
      ..._createAtividadesIntervencoeDto,
      id: null,
    };

    return dataAtividade;
    // await this.repo.save(dataAtividade);
    return 'This action adds a new atividadesIntervencoe';
  }

  findAll() {
    return `This action returns all atividadesIntervencoes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} atividadesIntervencoe`;
  }

  update(
    id: number,
    updateAtividadesIntervencoeDto: UpdateAtividadesIntervencoeDto,
  ) {
    return `This action updates a #${id} atividadesIntervencoe`;
  }

  remove(id: number) {
    return `This action removes a #${id} atividadesIntervencoe`;
  }
}
