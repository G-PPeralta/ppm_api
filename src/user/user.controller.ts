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
  HttpCode,
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
// import { LoggerDB } from 'decorators/logger-db.decorator';
import { sendConfirmationEmail } from 'utils/email/sendgrid';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      if (createUserDto.roleId)
        throw new InternalServerErrorException(UserService.errors.noRoleHere);

      const findUserByEmail = await this.userService.findOneByEmail(
        createUserDto.email,
      );

      if (findUserByEmail) throw Error(UserService.errors.emailExists);

      const user = await this.userService.create(createUserDto);

      return UserMapper.mapToUserDto(user);
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Post('resetar-senha')
  @HttpCode(200)
  async resetarSenha(@Body() { email: emailbody }: UpdateUserDto) {
    const user = await this.userService.findOneByEmail(emailbody);

    const { nome, email } = user;

    const sendCodigo = `${Math.round(Math.random() * 1000000)}`;

    try {
      await sendConfirmationEmail(nome, email, sendCodigo);

      return {
        message: 'Email enviado com sucesso!',
      };
    } catch (err: any) {
      throw new InternalServerErrorException(err.message);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Perfil.ADMIN)
  @Post('admin')
  async createUserFromAdmin(
    @Body() createUserDto: CreateUserDto,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // @LoggerDB() req,
  ) {
    try {
      const hasRoleId = createUserDto.roleId;
      if (!hasRoleId) throw Error(UserService.errors.roleRequired);

      const findUserByEmail = await this.userService.findOneByEmail(
        createUserDto.email,
      );

      if (findUserByEmail) throw Error(UserService.errors.emailExists);

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // @LoggerDB() req,
  ) {
    try {
      const user = await this.userService.update(+id, updateUserDto);
      return UserMapper.mapToUserDto(user);
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
