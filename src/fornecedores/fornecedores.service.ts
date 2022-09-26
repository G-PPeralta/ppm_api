import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateFornecedoreDto } from './dto/create-fornecedore.dto';
import { UpdateFornecedoreDto } from './dto/update-fornecedore.dto';

@Injectable()
export class FornecedoresService {
  constructor(private prisma: PrismaService) {}

  create(createFornecedoreDto: CreateFornecedoreDto) {
    return this.prisma.fornecedor.create({ data: createFornecedoreDto });
  }

  findAll() {
    return this.prisma.fornecedor.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} fornecedore`;
  }

  update(id: number, updateFornecedoreDto: UpdateFornecedoreDto) {
    return `This action updates a #${id} fornecedore`;
  }

  remove(id: number) {
    return `This action removes a #${id} fornecedore`;
  }
}
