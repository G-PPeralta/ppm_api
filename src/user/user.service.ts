import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { prismaClient } from 'index.prisma';
import { Encrypt64 } from 'utils/security/encrypt.security';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto) {
    const crypt = new Encrypt64();
    const novaSenha = crypt.toBase64fromsha512(createUserDto.senha);
    createUserDto.senha = novaSenha;
    Logger.log(createUserDto);
    return await prismaClient.user.create({ data: createUserDto });
  }

  async findAll() {
    const users = await prismaClient.user.findMany();
    return users;
  }

  async findOne(id: number) {
    return await prismaClient.user.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateUser: UpdateUserDto) {
    const findUser = await this.findOne(id);
    if (!findUser) throw Error('User not found');
    const user = await prismaClient.user.update({
      where: { id },
      data: updateUser,
    });
    return user;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async isLoginAndPasswordCorrect(
    email: string,
    senha: string,
  ): Promise<boolean> {
    const crypt = new Encrypt64();
    const novaSenha = crypt.toBase64fromsha512(senha);

    const user = await prismaClient.user.findFirst({
      where: {
        email,
        senha: novaSenha,
        // senha: 'abc@123'
      },
    });
    return Boolean(user);
  }

  async findOneByEmail(email: string) {
    return await prismaClient.user.findUnique({
      where: { email },
    });
  }

  async findUsersProfilePending() {
    return await prismaClient.$queryRawUnsafe(
      'select * from dev.get_users_pending',
    );
  }
}
