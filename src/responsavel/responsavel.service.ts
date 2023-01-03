import { Injectable } from '@nestjs/common';
// import { Prisma } from '@prisma/client';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateResponsavelDto } from './dto/create-responsavel.dto';
import { UpdateResponsavelDto } from './dto/update-responsavel.dto';
// import { ResponsavelEntity } from './entities/responsavel.entity';

@Injectable()
export class ResponsavelService {
  constructor(private prisma: PrismaService) {}

  // async create(responsavel: CreateResponsavelDto) {
  //   return await this.prisma.responsavel.create({
  //     data: responsavel,
  //   });
  // }

  async create(responsavel: CreateResponsavelDto) {
    return await this.prisma.$queryRawUnsafe(`
      INSERT INTO tb_responsaveis (nome_responsavel, ind_sistema) values ('${responsavel.nome}', '${responsavel.ind_sistema}')
    `);
  }

  async findAll() {
    const responsaveis = await this.prisma.responsavel.findMany();
    if (!responsaveis) throw new Error('Falha na listagem de projetos');
    return responsaveis;
  }

  async findAllProjetos(tipo: string) {
    return await this.prisma.$queryRawUnsafe(`
    select nome_responsavel as nome, responsavel_id as id from tb_responsaveis where ind_sistema='${tipo}'
   `);
  }

  async findByName(nome: string) {
    // const coordenador = await prismaClient.$queryRaw(Prisma.sql`
    // select coordenador_nome from dev.tb_coordenadores tc where coordenador_nome=${nome};
    // `);
    const responsavel = await this.prisma.responsavel.findFirst({
      where: {
        nome,
      },
    });
    return responsavel;
  }

  findOne(id: number) {
    return `This action returns a #${id} responsavel`;
  }

  update(id: number, updateResponsavelDto: UpdateResponsavelDto) {
    return `This action updates a #${id} responsavel`;
  }

  remove(id: number) {
    return `This action removes a #${id} responsavel`;
  }
}
