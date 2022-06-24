import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  InternalServerErrorException,
  UseGuards,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserMapper } from 'utils/mapper/userMapper';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from 'auth/guards/roles.guard';
import { Roles } from 'auth/roles/roles.decorator';
import { Perfil } from 'types/roles';
import { UserWithRole } from './dto/user-with-role.dto';
import { json } from 'body-parser';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      if (createUserDto.role_id)
        throw new InternalServerErrorException('No includes role_id here');

      const findUserByEmail = await this.userService.findOneByEmail(
        createUserDto.email,
      );

      if (findUserByEmail) throw Error('Email already exists');

      const user = await this.userService.create(createUserDto);

      return UserMapper.mapToUserDto(user);
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Perfil.ADMIN)
  @Post('admin')
  async createUserFromAdmin(@Body() createUserDto: CreateUserDto) {
    try {
      const hasRoleId = createUserDto.role_id;
      if (!hasRoleId) throw Error('role_id is required');

      const findUserByEmail = await this.userService.findOneByEmail(
        createUserDto.email,
      );

      if (findUserByEmail) throw Error('Email already exists');

      const user = await this.userService.create(createUserDto);
      return UserMapper.mapToUserDto(user);
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Perfil.ADMIN)
  @Get('pending')
  async findAllPending() {
    try {
      const users = await this.userService.findUsersProfilePending();
      return users;
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ) {
    console.log({
      rota: req.originalUrl,
      requisicao: req.method,
      usuario: req.user,
    });
    try {
      const reqUser: UserWithRole = req.user;
      const idsIsEquals = reqUser.id === +id;

      return idsIsEquals;

      // VERIFICAR: um usuario poderá alterar outro ?
      // if (!idsIsEquals) throw new Error(`You cannot update other user`);

      const user = await this.userService.update(+id, updateUserDto);
      return UserMapper.mapToUserDto(user);
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return { name: this.remove.name + UserController.name };
    return this.userService.remove(+id);
  }
}
