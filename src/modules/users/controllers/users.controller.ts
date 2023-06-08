import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { UsersService } from '../services/user.service';
import { ValidationError } from '../../../errors/ValidationError';
import { LoginUserDto } from '../dto/login-user.dto';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('login')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const tokens = await this.usersService.login(loginUserDto);
    response.cookie('access_token', tokens.accessToken);
    response.cookie('refresh_token', tokens.refreshToken);
  }

  @Post('register')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async register(@Body() createUserDto: CreateUserDto): Promise<void> {
    try {
      await this.usersService.create(createUserDto);
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        throw error.message;
      }
    }
  }
}
