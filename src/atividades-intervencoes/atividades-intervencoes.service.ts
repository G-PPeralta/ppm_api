import { Injectable } from '@nestjs/common';
import { CreateAtividadesIntervencoeDto } from './dto/create-atividades-intervencao.dto';
import { SaveAtividadesIntervencoeDto } from './dto/save-atividades-intervencoes-dto';
import { SaveAtividadesPrecedentesDto } from './dto/save-atividades-precedentes.dto';
import { UpdateAtividadesIntervencoeDto } from './dto/update-atividades-intervencao.dto';
import { AtividadeIntervencaoRepository } from './repository/atividades-invervencoes.repository';

@Injectable()
export class AtividadesIntervencoesService {
  constructor(private readonly repo: AtividadeIntervencaoRepository) {}
  async create(
    _createAtividadesIntervencoeDto: CreateAtividadesIntervencoeDto,
  ) {
    try {
      await this.repo.save(_createAtividadesIntervencoeDto);
      return 'Atividades Intervencoes salvo com sucesso';
    } catch (e) {
      return 'erro ao sentar salvar atividades intervencao.';
    }
  }

  async findAll() {
    const atividadesList = await this.repo.atividadesist();
    return atividadesList.map((atividade) => {
      return { ...atividade, nome: atividade.tarefa.tarefa };
    });
  }

  async findOne(id: number) {
    return await this.repo.getOneOrFail(id);
  }

  /* update(
    id: number,
    updateAtividadesIntervencoeDto: UpdateAtividadesIntervencoeDto,
  ) {
    return `This action updates a #${id} atividadesIntervencoe`;
  }

  remove(id: number) {
    return `This action removes a #${id} atividadesIntervencoe`;
  }*/
}
