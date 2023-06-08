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
import { JWTHelper } from '../../../helpers/JWTHelper';
import { endWithStatus } from '../../../helpers/ResponseHelper';
import { TransactionsService } from '../../transactions/services/transactions.service';
import { User } from "../entities/user.entity";

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private transactionsService: TransactionsService,
  ) {}

  @Get()
  public async getUser(@Req() request: Request) {
    const { name, surname, email } = await this.usersService.getCurrentUser(
      request,
    );
    return { name, surname, email };
  }

  @Get('balance')
  public async getUserBalance(@Req() request: Request): Promise<number> {
    const user: User = await this.usersService.getCurrentUser(request);
    return await this.transactionsService.getBalance(user);
  }

  @Post('login')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const { accessToken, refreshToken } = await this.usersService.login(
      loginUserDto,
    );
    response.cookie('access_token', accessToken);
    response.cookie('refresh_token', refreshToken);
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
