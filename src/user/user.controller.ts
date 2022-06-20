import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserMapper } from 'utils/mapper/userMapper';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'auth/roles/roles.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const findUserByEmail = await this.userService.findOneByEmail(
        createUserDto.email,
      );
      const hasPerfil = createUserDto.perfil;

      if (hasPerfil) throw Error(`Don't use Perfil here`);
      if (findUserByEmail) throw Error('Email already exists');

      const user = await this.userService.create(createUserDto);

      return UserMapper.mapToUserDto(user);
    } catch (error: any) {
      return new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Post('admin')
  async createUserFromAdmin(@Body() createUserDto: CreateUserDto) {
    try {
      const hasPefil = createUserDto.perfil;
      if (!hasPefil) throw Error('Perfil is required');

      const user = await this.userService.create(createUserDto);
      return UserMapper.mapToUserDto(user);
    } catch (error: any) {
      return new InternalServerErrorException(error.message);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('pending')
  async findAllPending() {
    const users = await this.userService.findUsersProfilePending();
    return users;
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return UserMapper.mapToListUserShortenedDto(users);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    return UserMapper.mapToUserDto(user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string) {
    return this.userService.update(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
