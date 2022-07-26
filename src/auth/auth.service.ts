import { LoginDto } from './../user/dto/login.dto';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { Encrypt64 } from 'utils/security/encrypt.security';

import * as jwt from 'jsonwebtoken';
import { join } from 'path';

import * as fs from 'fs';
import { User } from '@prisma/client';
import { UserMapper } from 'utils/mapper/userMapper';
import { UserWithRole } from 'user/dto/user-with-role.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    const crypt = new Encrypt64();
    const encryptPassword = crypt.toBase64fromsha512(password);

    if (user && user.senha === encryptPassword) {
      return user;
    }
    return null;
  }

  async login(user: LoginDto) {
    const { email, senha } = user;

    if (!email || !senha) throw new InternalServerErrorException();

    // VERIFY USER
    const validatedUser = await this.usersService.isLoginAndPasswordCorrect(
      email,
      senha,
    );

    if (!validatedUser)
      throw new InternalServerErrorException(`User not found`);

    let userByEmail = await this.usersService.findOneByEmail(email);

    userByEmail = UserMapper.mapToUserDto(userByEmail);

    const jwtPayload = { ...userByEmail };

    const refreshToken = this.createRefreshToken(userByEmail.id);

    return {
      validatedUser,
      user: userByEmail,
      access_token: this.jwtService.sign(jwtPayload),
      refresh_token: refreshToken,
    };
  }

  public verifyToken(token: string): any {
    const decoded = jwt.verify(token, this.getPublicKey(), {
      ignoreExpiration: true,
    });

    return decoded;
  }

  getPrivateKey() {
    const caminho = join(process.cwd(), 'src', 'config', 'private.key');

    const privateKey = fs.readFileSync(caminho, 'utf8');

    return privateKey;
  }

  getPublicKey() {
    const caminho = join(process.cwd(), 'src', 'config', 'public.key');

    const publicKey = fs.readFileSync(caminho, 'utf8');

    return publicKey;
  }

  createRefreshToken(userId: number) {
    const privateKey = this.getPrivateKey();

    const token = jwt.sign({ userId }, privateKey, {
      expiresIn: '2h',
      algorithm: 'RS256',
    });

    return token;
  }

  async validateLocalRefreshToken(refreshToken: string) {
    try {
      const result: any = jwt.verify(refreshToken, this.getPublicKey());

      if (!result || !result.userId) throw new Error('Token inválido [00]');

      return result;
    } catch (error) {
      throw new Error('Erro ao verificar token');
    }
  }

  async regenerateAccessToken(userId: number) {
    const user = await this.usersService.findOne(userId);

    if (!user) throw new Error('Token inválido [01]');

    const accessToken = this.jwtService.sign({ user });

    return accessToken;
  }

  async handleRefreshToken(refreshToken: string) {
    const decoded = await this.validateLocalRefreshToken(refreshToken);

    const token = await this.regenerateAccessToken(decoded.userId);

    return { token };
  }
}
