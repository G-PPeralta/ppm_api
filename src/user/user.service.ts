import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { prismaClient } from 'index.prisma';
import { Encrypt64 } from 'utils/security/encrypt.security';
import { UpdateUserDto } from './dto/update-user.dto';
import { validate } from 'class-validator';
import { Prisma } from '@prisma/client';
import { UserWithRole } from './dto/user-with-role.dto';

@Injectable()
export class UserService {
  private encryptPassword(password: string) {
    const crypt = new Encrypt64();
    const newPassword = crypt.toBase64fromsha512(password);
    return newPassword;
  }
  async create(createUserDto: CreateUserDto) {
    const novaSenha = this.encryptPassword(createUserDto.senha);
    createUserDto.senha = novaSenha;

    validate(createUserDto).catch((error) => {
      throw new Error(error.message);
    });

    return await prismaClient.user.create({ data: createUserDto });
  }

  async findAll() {
    const users = await prismaClient.$queryRawUnsafe(
      'select * from dev.v_users_with_role',
    );
    return users;
  }

  async findOne(id: number) {
    const users = await prismaClient.$queryRawUnsafe(
      `select * from dev.v_users_with_role where id = $1`,
      id,
    );
    return users;
  }

  async update(id: number, updateUser: UpdateUserDto) {
    const findUser = await prismaClient.user.findUnique({ where: { id: id } });
    if (!findUser) throw Error('User not found');

    const ifExistPassword = Boolean(updateUser.senha);

    if (ifExistPassword) {
      const novaSenha = this.encryptPassword(updateUser.senha);
      updateUser.senha = novaSenha;
    }

    const newUser = { ...findUser, ...updateUser };

    const user = await prismaClient.user.update({
      where: { id },
      data: newUser,
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
    const novaSenha = this.encryptPassword(senha);

    const user = await prismaClient.user.findFirst({
      where: {
        email,
        senha: novaSenha,
      },
    });
    return Boolean(user);
  }

  async findOneByEmail(email: string) {
    const result: UserWithRole[] = await prismaClient.$queryRaw(
      Prisma.sql`select * from dev.v_users_to_auth WHERE email = ${email}`,
    );

    return result[0];
  }

  async findUsersProfilePending() {
    return await prismaClient.$queryRawUnsafe(
      'select * from dev.v_users_pending',
    );
  }
}
