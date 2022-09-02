import { Injectable } from '@nestjs/common';
import { CreateAreaAtuacaoDto } from './dto/create-area-atuacao.dto';
import { UpdateAreaAtuacaoDto } from './dto/update-area-atuacao.dto';
import { AreaAtuacaoRepository } from './repository/area-atuacao.repository';

@Injectable()
export class AreaAtuacaoService {
  constructor(private repo: AreaAtuacaoRepository) {}

  create(createAreaAtuacaoDto: CreateAreaAtuacaoDto) {
    try {
      return this.repo.save(createAreaAtuacaoDto);
    } catch (e) {
      return 'Nâo foi possivel salvar area de atuação.';
    }
  }

  findAll() {
    const area = this.repo.getAll();
    return area;
  }

  findOne(id: number) {
    return `This action returns a #${id} areaAtuacao`;
  }

  update(id: number, updateAreaAtuacaoDto: UpdateAreaAtuacaoDto) {
    return `This action updates a #${id} areaAtuacao`;
  }

  remove(id: number) {
    return `This action removes a #${id} areaAtuacao`;
  }
}
