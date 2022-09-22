import { Injectable } from '@nestjs/common';
import { CreateCampoDto } from './dto/create-campo.dto';
import { UpdateCampoDto } from './dto/update-campo.dto';
import { CampoRepository } from './repositories/campo.repository';

@Injectable()
export class CamposService {
  constructor(private repo: CampoRepository) {}
  async create(createCampoDto: CreateCampoDto) {
    try {
      await this.repo.save(createCampoDto);

      return 'Campo salvo com sucesso';
    } catch (e) {
      return 'não é possivel salvar no momento';
    }
  }

  findAll() {
    try {
      return this.repo.camposList();
    } catch (e) {
      return 'não é possivel retornar lista  no momento';
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} campo`;
  }

  update(id: number, updateCampoDto: UpdateCampoDto) {
    return `This action updates a #${id} campo`;
  }

  remove(id: number) {
    return `This action removes a #${id} campo`;
  }
}
