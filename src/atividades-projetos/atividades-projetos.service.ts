import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
// import { CreateAtividadesProjetoDto } from './dto/create-atividades-projeto.dto';
// import { UpdateAtividadesProjetoDto } from './dto/update-atividades-projeto.dto';

@Injectable()
export class AtividadesProjetosService {
  constructor(private prisma: PrismaService) {}

  // create(createAtividadesProjetoDto: CreateAtividadesProjetoDto) {
  //   return 'This action adds a new atividadesProjeto';
  // }

  findAll() {
    return this.prisma.atividade.findMany();
  }

  async findOne(id: number) {
    return await this.prisma
      .$queryRaw`select * from tb_projetos_atividade where id_projeto = ${id} and dat_usu_erase is null;`;
  }

  // update(id: number, updateAtividadesProjetoDto: UpdateAtividadesProjetoDto) {
  //   return `This action updates a #${id} atividadesProjeto`;
  // }

  remove(id: number) {
    return `This action removes a #${id} atividadesProjeto`;
  }
}
