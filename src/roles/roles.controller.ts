/**
 * CRIADO EM: 22/06/2022
 * AUTOR: GABRIEL PERALTA
 * DESCRIÇÃO: endpoints que retorna os roles que determinam os níveis de acesso da aplicação
 */

import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Roles } from '../auth/roles/roles.decorator';
import { Perfil } from '../types/roles';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Perfil.ADMIN)
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }
}
