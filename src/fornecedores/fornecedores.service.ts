import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateFornecedoreDto } from './dto/create-fornecedore.dto';
import { UpdateFornecedorDto } from './dto/update-fornecedore.dto';

@Injectable()
export class FornecedoresService {
  constructor(private prisma: PrismaService) {}

  async create(createFornecedoreDto: CreateFornecedoreDto) {
    return await this.prisma.$queryRawUnsafe(`
      INSERT INTO tb_fornecedores 
      (poloId, servicoId, statusId, nomeFornecedor, numeroContrato, representante, email, telefone, invoice, cnpj, justificativa, outrasInformacoes, nom_usu_create, dat_usu_create)
      VALUES
      (${createFornecedoreDto.poloId}, ${createFornecedoreDto.servicoId}, ${createFornecedoreDto.statusId}, '${createFornecedoreDto.nomeFornecedor}',
      '${createFornecedoreDto.numeroContrato}', '${createFornecedoreDto.representante}', '${createFornecedoreDto.email}', '${createFornecedoreDto.telefone}',
      '${createFornecedoreDto.invoice}', '${createFornecedoreDto.cnpj}', '${createFornecedoreDto.justificativa}', '${createFornecedoreDto.outrasInformacoes}',
      '${createFornecedoreDto.nom_usu_create}', now())
    `);
  }

  findAll() {
    return this.prisma.$queryRawUnsafe(`
      SELECT * FROM tb_fornecedores
    `);
  }

  findOne(id: number) {
    return this.prisma.$queryRawUnsafe(`
      SELECT * FROM tb_fornecedores WHERE id = ${id}
    `);
  }

  async update(updateFornecedoreDto: UpdateFornecedorDto) {
    return await this.prisma.$queryRawUnsafe(`
      UPDATE
      tb_fornecedores
      SET
      poloid = ${updateFornecedoreDto.poloid},
      servico_txt = '${updateFornecedoreDto.servico_txt}',
      statusid = ${updateFornecedoreDto.statusid},
      nomefornecedor = '${updateFornecedoreDto.nomefornecedor}',
      numerocontrato = '${updateFornecedoreDto.numerocontrato}',
      representante = '${updateFornecedoreDto.representante}',
      email = '${updateFornecedoreDto.email}',
      invoice ='${updateFornecedoreDto.invoice}',
      cnpj = '${updateFornecedoreDto.cnpj}',
      telefone = '${updateFornecedoreDto.telefone}',
      outrasinformacoes = '${updateFornecedoreDto.outrasinformacoes}',
      nom_usu_create = '${updateFornecedoreDto.nom_usu_create}'
      WHERE
      id = ${updateFornecedoreDto.id}
    `);
  }

  remove(id: number) {
    return `This action removes a #${id} fornecedore`;
  }
}
