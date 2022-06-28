import { UserShortenedDto } from '../../user/dto/user-shortened.dto';

import { User } from '@prisma/client';
import { LoginDto } from 'user/dto/login.dto';
import { UserWithRole } from 'user/dto/user-with-role.dto';

export class UserMapper {
  static mapToUserDto(user: Partial<UserWithRole>): any {
    delete user.senha;
    return user;
  }

  static emptyEntity(): User {
    return {
      id: 0,
      area_atuacao: '',
      email: '',
      nome: '',
      role_id: 2,
      telefone: '',
      senha: '',
    };
  }

  static mapFromLoginDto(dto: LoginDto): User {
    const _user = this.emptyEntity();
    _user.email = dto.email;
    _user.senha = dto.senha;
    return _user;
  }

  static mapToListUserShortenedDto(users: UserWithRole[]): UserShortenedDto[] {
    return users.map((user) => this.mapToUserDto(user));
  }
}
