import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateCampanhaDto } from './dto/create-campanha.dto';
import { UpdateCampanhaDto } from './dto/update-campanha.dto';

@Injectable()
export class CampanhaService {
  constructor(private prisma: PrismaService) {}

  create(createCampanhaDto: CreateCampanhaDto) {
    return 'This action adds a new campanha';
  }

  findAll() {
    return this.prisma.campanhas.findMany();
  }

  findOne(id: number) {
    return this.prisma.campanhas.findUnique({
      where: { id },
    });
  }

  update(id: number, updateCampanhaDto: UpdateCampanhaDto) {
    return `This action updates a #${id} campanha`;
  }

  remove(id: number) {
    return `This action removes a #${id} campanha`;
  }
}
