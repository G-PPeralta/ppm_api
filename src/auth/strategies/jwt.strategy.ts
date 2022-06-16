import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { jwtConstants } from 'auth/constants';
import { Encrypt64 } from 'utils/security/encrypt.security';
import { User } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any): Promise<User> {
    const { email, senha } = payload;

    const crypt = new Encrypt64();
    if (!email) throw new BadRequestException('Nenhum login informado');
    if (!senha) throw new BadRequestException('Nenhuma senha informada');
    // if (!role) throw new BadRequestException('Nenhuma role informada');

    const cryptedPassword = crypt.toBase64fromsha512(payload.senha);
    return { senha: cryptedPassword, ...payload };
  }
}
