import { SetMetadata } from '@nestjs/common';
import { Perfil } from 'types/roles';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Perfil[]) => SetMetadata(ROLES_KEY, roles);
