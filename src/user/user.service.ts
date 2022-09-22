import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Encrypt64 } from '../utils/security/encrypt.security';
import { UpdateUserDto } from './dto/update-user.dto';
import { validate } from 'class-validator';
import { Prisma } from '@prisma/client';
import { UserWithRole } from './dto/user-with-role.dto';
import { PrismaService } from '../services/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  static errors = {
    emailExists: 'Email already exists',
    noRoleHere: 'No includes role_id here',
    roleRequired: 'role_id is required',
    userNotFound: 'User not found',
  };

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

    return await this.prisma.user.create({ data: createUserDto });
  }

  async findAll() {
    const users = await this.prisma.$queryRaw`select * from v_users_with_role`;
    return users;
  }

  async findOne(id: number) {
    const users = await this.prisma
      .$queryRaw`select * from v_users_with_role where id = ${id}`;
    return users;
  }

  async update(id: number, updateUser: UpdateUserDto) {
    const findUser = await this.prisma.user.findUnique({ where: { id: id } });
    if (!findUser) throw Error(UserService.errors.userNotFound);

    const ifExistPassword = Boolean(updateUser.senha);

    if (ifExistPassword) {
      const novaSenha = this.encryptPassword(updateUser.senha);
      updateUser.senha = novaSenha;
    }

    const newUser = { ...findUser, ...updateUser };

    const user = await this.prisma.user.update({
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

    const user = await this.prisma.user.findFirst({
      where: {
        email,
        senha: novaSenha,
      },
    });
    return Boolean(user);
  }

  async findOneByEmail(email: string) {
    const result: UserWithRole[] = await this.prisma.$queryRaw(
      Prisma.sql`select * from v_users_to_auth WHERE email = ${email}`,
    );

    return result[0];
  }

  async findUsersProfilePending() {
    return await this.prisma.$queryRaw`select * from v_users_pending`;
  }
}
