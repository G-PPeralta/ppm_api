/**
 * CRIADO EM: 22/06/2022
 * AUTOR: GABRIEL PERALTA
 * DESCRIÇÃO: serviço que list os roles que determinam os níveis de acesso da aplicação
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.role.findMany();
  }
}
