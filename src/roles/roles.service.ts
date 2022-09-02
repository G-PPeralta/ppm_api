import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';

@Injectable()
export class RolesService {
  /* Verificar necessidade de ter o crud completo do perfil(role).
   * Pois teremos que atualizar todas as rotas para os novos;
   * Criar mais valores para o enum Perfil localizado em "../types/roles.ts;
   * Colocar os respectivos valores nas rotas informadas para cada;
   */

  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.role.findMany();
  }
}
