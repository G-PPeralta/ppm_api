import { prismaStudio } from 'src/prisma';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto) {
    return await prismaStudio.user.create({ data: createUserDto });
  }

  async findAll() {
    return await prismaStudio.user.findMany();
  }

  async findOne(id: number) {
    return await prismaStudio.user.findUnique({ where: { id } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
