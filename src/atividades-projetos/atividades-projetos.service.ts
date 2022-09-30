import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateAtividadesProjetoDto } from './dto/create-atividades-projeto.dto';
import { UpdateAtividadesProjetoDto } from './dto/update-atividades-projeto.dto';

@Injectable()
export class AtividadesProjetosService {
  constructor(private prisma: PrismaService) {}

  create(createAtividadesProjetoDto: CreateAtividadesProjetoDto) {
    return 'This action adds a new atividadesProjeto';
  }

  findAll() {
    return this.prisma.atividade.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} atividadesProjeto`;
  }

  update(id: number, updateAtividadesProjetoDto: UpdateAtividadesProjetoDto) {
    return `This action updates a #${id} atividadesProjeto`;
  }

  remove(id: number) {
    return `This action removes a #${id} atividadesProjeto`;
  }
}
