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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    // @Res() res: Response
  ) {
    try {
      const findUserByEmail = await this.userService.findOneByEmail(
        createUserDto.email,
      );
      if (findUserByEmail) throw Error('Email already exists');
      return await this.userService.create(createUserDto);
    } catch (error: any) {
      return new InternalServerErrorException(error.message);
      // return res.status(500).send({ message: error.message, status: 500 });
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
