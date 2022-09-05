import { Injectable } from '@nestjs/common';
import { CreateIntervencaoDto } from './dto/create-intervencao.dto';
import { IntervencaoRepository } from './repositories/intervencoes.repository';
// import { UpdateIntervencoeDto } from './dto/update-intervencao.dto';

@Injectable()
export class IntervencoesService {
  constructor(private repo: IntervencaoRepository) {}

  async create(createIntervencoeDto: CreateIntervencaoDto) {
    try {
      await this.repo.save(createIntervencoeDto);
      return 'Nova intervencao foi criadoa com sucesso!';
    } catch (e) {
      return 'Não  foi possivel salvar ';
    }
  }

  findAll() {
    return this.repo.intervencoesList();
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
