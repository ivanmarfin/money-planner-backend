import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { CreateIncomeDto } from '../dto/create-income.dto';
import { TransactionsService } from '../services/transactions.service';
import { UsersService } from '../../users/services/user.service';
import { Request } from 'express';
import { User } from '../../users/entities/user.entity';
import { CreateConsumptionDto } from '../dto/create-consumption.dto';
import { Income } from '../entities/income.entity';
import { Consumption } from "../entities/consumption.entity";

@Controller('transactions')
export class TransactionsController {
  constructor(
    private transactionsService: TransactionsService,
    private userService: UsersService,
  ) {}

  @Get('income')
  public async getIncomes(@Req() request: Request): Promise<Income[]> {
    const user: User = await this.userService.getCurrentUser(request);
    return await this.transactionsService.getIncomes(user);
  }

  @Get('consumption')
  public async getConsumptions(@Req() request: Request): Promise<Consumption[]> {
    const user: User = await this.userService.getCurrentUser(request);
    return await this.transactionsService.getConsumptions(user);
  }

  @Post('income')
  public async createIncome(
    @Req() request: Request,
    @Body() createIncomeDto: CreateIncomeDto,
  ): Promise<void> {
    const user: User = await this.userService.getCurrentUser(request);
    return await this.transactionsService.createIncome(createIncomeDto, user);
  }

  @Post('consumption')
  public async createConsumption(
    @Req() request: Request,
    @Body() createConsumptionDto: CreateConsumptionDto,
  ): Promise<void> {
    const user: User = await this.userService.getCurrentUser(request);
    return await this.transactionsService.createConsumption(
      createConsumptionDto,
      user,
    );
  }
}
