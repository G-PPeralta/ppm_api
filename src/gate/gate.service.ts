import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateGateDto } from './dto/create-gate.dto';
import { UpdateGateDto } from './dto/update-gate.dto';

@Injectable()
export class GateService {
  constructor(private prisma: PrismaService) {}
  async create(createGateDto: CreateGateDto) {
    await this.prisma.$queryRawUnsafe(`

        INSERT INTO tb_gates(gate, deletado)
        VALUES
        ('${createGateDto.gate}', false)
        ON CONFLICT (gate)
        DO update SET gate = '${createGateDto.gate}', deletado = false

      `);
  }

  findAll() {
    const gates = this.prisma.gate.findMany({ where: { deletado: false } });
    if (!gates) throw new Error('Falha na listagem de gates');
    return gates;
  }

  findOne(id: number) {
    return `This action returns a #${id} gate`;
  }

  update(id: number, updateGateDto: UpdateGateDto) {
    return `This action updates a #${id} gate`;
  }

  remove(id: number) {
    return `This action removes a #${id} gate`;
  }
}
