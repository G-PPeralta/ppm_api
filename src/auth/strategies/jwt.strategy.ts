import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { jwtConstants } from 'auth/constants';
import { User } from '@prisma/client';
import { UserService } from 'user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any): Promise<User> {
    const { email } = payload;
    const user = await this.userService.findOneByEmail(email);

    const { email: _email, senha: _senha } = user;

    // const crypt = new Encrypt64();
    if (!_email) throw new BadRequestException('Nenhum login informado');
    if (!_senha) throw new BadRequestException('Nenhuma senha informada');
    // if (!role) throw new BadRequestException('Nenhuma role informada');

    // const cryptedPassword = crypt.toBase64fromsha512(senha);
    return { ...payload };
  }
}
