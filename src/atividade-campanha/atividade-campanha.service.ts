import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateAtividadeCampanhaDto } from './dto/create-atividade-campanha.dto';
import { UpdateAtividadeCampanhaDto } from './dto/update-atividade-campanha.dto';

@Injectable()
export class AtividadeCampanhaService {
  constructor(private prisma: PrismaService) {}
  create(_createAtividadeCampanhaDto: CreateAtividadeCampanhaDto) {
    this.prisma.atividadeIntervencao.create({
      data: _createAtividadeCampanhaDto,
    });
    return 'This action adds a new atividadeCampanha';
  }

  findAll() {
    return this.prisma.atividadeIntervencao.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} atividadeCampanha`;
  }

  update(id: number, updateAtividadeCampanhaDto: UpdateAtividadeCampanhaDto) {
    return `This action updates a #${id} atividadeCampanha`;
  }

  remove(id: number) {
    return `This action removes a #${id} atividadeCampanha`;
  }
}
