import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateLocalDto } from './dto/create-local.dto';
import { UpdateLocalDto } from './dto/update-local.dto';

@Injectable()
export class LocalService {
  constructor(private prisma: PrismaService) {}
  async create(createLocalDto: CreateLocalDto) {
    // await this.prisma.local.create({ data: createLocalDto });
    await this.prisma.$queryRawUnsafe(`
      insert into tb_locais (local, deletado) values ('${createLocalDto.local}', ${createLocalDto.deletado});
    `);
  }

  findAll() {
    // const local = this.prisma.local.findMany();
    // if (!local) throw new Error('Falha na listagem de locais');

    const local = this.prisma.$queryRawUnsafe(`
      select a.id, concat(c.polo, ' - ', local) as local
      from tb_locais a
      left join tb_polos_locais b 
        on a.id = b.id_local
      left join tb_polos c 
        on b.id_polo = c.id 
      where a.deletado = false order by local;
    `);
    return local;
  }

  findOne(id: number) {
    return `This action returns a #${id} local`;
  }

  update(id: number, updateLocalDto: UpdateLocalDto) {
    return `This action updates a #${id} local`;
  }

  remove(id: number) {
    return `This action removes a #${id} local`;
  }
}
