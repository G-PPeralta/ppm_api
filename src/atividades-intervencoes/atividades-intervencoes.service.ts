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
    try {
      return await this.repo.save(_createAtividadesIntervencoeDto);
    } catch (e) {
      return 'erro ao sentar salvar atividades intervencao.';
    }
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
