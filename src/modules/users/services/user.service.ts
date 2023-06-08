import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { compare, genSalt, hash } from 'bcrypt';
import { ValidationError } from '../../../errors/ValidationError';
import { LoginUserDto } from '../dto/login-user.dto';
import { JWTHelper } from '../../../helpers/JWTHelper';
import { Request } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  public async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  public async create(createUserDto: CreateUserDto) {
    const isNewestEmail = await this.findOneByEmail(createUserDto.email);
    if (isNewestEmail) {
      throw new ValidationError('Email is not unique');
    }
    await this.usersRepository.insert({
      email: createUserDto.email,
      name: createUserDto.name,
      surname: createUserDto.surname,
      passwordHash: await hash(createUserDto.password, await genSalt(10)),
    });
  }

  public async login(loginUserDto: LoginUserDto) {
    const user = await this.findOneByEmail(loginUserDto.email);
    if (!user) {
      throw Error('User not found');
    }
    const isPasswordValid = await compare(
      loginUserDto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw Error('Password is invalid');
    }
    const tokens = {
      accessToken: JWTHelper.generateAccessToken(user.email),
      refreshToken: JWTHelper.generateRefreshToken(user.email),
    };
    await this.usersRepository.update({ email: user.email }, tokens);
    return tokens;
  }

  public async renewAccessToken(email: string) {
    const accessToken = JWTHelper.generateAccessToken(email);
    await this.usersRepository.update({ email }, { accessToken });
    return accessToken;
  }

  public async getCurrentUser(request: Request): Promise<User> {
    const { access_token } = request.cookies;
    const { email } = JWTHelper.decodeToken(access_token);
    const user = await this.findOneByEmail(email);
    if (user) return user;
    throw new Error('User not found');
  }
}
