import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from 'auth/auth.service';
import { LoginDto } from 'user/dto/login.dto';
import { UserMapper } from 'utils/mapper/userMapper';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('auth')
  async login(@Body() body: LoginDto) {
    const login = await this.authService.login(
      UserMapper.mapFromLoginDto(body),
    );
    return login;
  }
}
