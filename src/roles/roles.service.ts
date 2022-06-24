import { Injectable } from '@nestjs/common';
import { prismaClient } from 'index.prisma';

@Injectable()
export class RolesService {
  /* Verificar necessidade de ter o crud completo do perfil(role).
   * Pois teremos que atualizar todas as rotas para os novos;
   * Criar mais valores para o enum Perfil localizado em "../types/roles.ts;
   * Colocar os respectivos valores nas rotas informadas para cada;
   */

  findAll() {
    return prismaClient.role.findMany();
  }
}
