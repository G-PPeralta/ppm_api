import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(email: string, password: string): Promise<any> {
    if (!email || !password)
      throw new InternalServerErrorException(
        'Verifique o login e a senha informados.',
      );
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new InternalServerErrorException('Usuário ou senha inválidos.');
    }
    return user;
  }
}
