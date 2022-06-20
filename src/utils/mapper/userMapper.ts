import { UserShortenedDto } from '../../user/dto/user-shortened.dto';

import { User } from '@prisma/client';
import { LoginDto } from 'user/dto/login.dto';

export class UserMapper {
  static mapToUserDto(user: User): UserShortenedDto {
    return {
      id: user.id,
      area_atuacao: user.area_atuacao,
      email: user.email,
      nome: user.nome,
      perfil: user.perfil,
      telefone: user.telefone,
    };
  }

  static emptyEntity(): User {
    return {
      id: 0,
      area_atuacao: '',
      email: '',
      nome: '',
      perfil: 'USER',
      telefone: '',
      senha: '',
    };
  }

  static mapFromLoginDto(dto: LoginDto): User {
    const _user = this.emptyEntity();
    _user.email = dto.email;
    _user.senha = dto.password;
    return _user;
  }

  static mapToListUserShortenedDto(users: User[]): UserShortenedDto[] {
    return users.map((user) => this.mapToUserDto(user));
  }
}
