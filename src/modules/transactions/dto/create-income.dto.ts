import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateIncomeDto {
  @IsNotEmpty()
  @IsNumber()
  sum: number;

  @IsNotEmpty()
  @IsNumber()
  date: number;
}
