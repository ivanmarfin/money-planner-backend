import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Income } from '../entities/income.entity';
import { CreateIncomeDto } from '../dto/create-income.dto';
import { User } from '../../users/entities/user.entity';
import { Consumption } from '../entities/consumption.entity';
import { CreateConsumptionDto } from '../dto/create-consumption.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Income)
    private incomeRepository: Repository<Income>,
    @InjectRepository(Consumption)
    private consumptionRepository: Repository<Consumption>,
  ) {}

  public async createIncome(dto: CreateIncomeDto, user: User): Promise<void> {
    const model: Income = this.incomeRepository.create();
    model.date = dto.date;
    model.sum = dto.sum;
    model.user = user.id;
    await this.incomeRepository.insert(model);
  }

  public async createConsumption(
    dto: CreateConsumptionDto,
    user: User,
  ): Promise<void> {
    const model: Income = this.consumptionRepository.create();
    model.date = dto.date;
    model.sum = dto.sum;
    model.user = user.id;
    await this.consumptionRepository.insert(model);
  }

  public async getIncomes(user: User): Promise<Income[]> {
    return await this.incomeRepository.findBy({ user: user.id });
  }

  async getConsumptions(user: User): Promise<Consumption[]> {
    return await this.consumptionRepository.findBy({ user: user.id });
  }

  public async getBalance(user: User): Promise<number> {
    const [incomes, consumptions] = await Promise.all([
      this.getIncomes(user),
      this.getConsumptions(user),
    ]);
    const incomesSum = incomes.reduce(
      (acc: number, cur: Income) => (acc += cur.sum),
      0,
    );
    const consumptionsSum = consumptions.reduce(
      (acc: number, cur: Consumption) => (acc += cur.sum),
      0,
    );
    return incomesSum - consumptionsSum;
  }
}
