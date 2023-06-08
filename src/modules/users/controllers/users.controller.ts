import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { UsersService } from '../services/user.service';
import { ValidationError } from '../../../errors/ValidationError';
import { LoginUserDto } from '../dto/login-user.dto';
import { Request, Response } from 'express';
import { DecodedToken } from '../../../types/decodedToken';
import { JWTHelper } from '../../../helpers/JWTHelper';
import { endWithStatus } from '../../../helpers/ResponseHelper';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  public async getUser() {
    return 'User';
  }

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

  @Post('refresh-auth')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async refreshAuth(@Req() request: Request, @Res() response: Response) {
    const { refresh_token } = request.cookies;
    if (!JWTHelper.isTokenValid(refresh_token)) {
      return endWithStatus(response, HttpStatus.UNAUTHORIZED);
    }
    const { email } = JWTHelper.decodeToken(refresh_token);
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      return endWithStatus(response, HttpStatus.NOT_FOUND);
    }
    const token = await this.usersService.renewAccessToken(email);
    response.cookie('access_token', token);
    response.end();
  }
}
