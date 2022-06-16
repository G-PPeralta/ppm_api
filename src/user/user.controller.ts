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
import { LocalAuthGuard } from 'auth/guards/local-auth.guard';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.create(createUserDto);
    } catch (error: any) {
      return new InternalServerErrorException(error.message);
    }
  }

  @Get('pending')
  async findAllPending() {
    const users = await this.userService.findUsersProfilePending();
    return users;
  }

  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return UserMapper.mapToListUserShortenedDto(users);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    return UserMapper.mapToUserDto(user);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.userService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
