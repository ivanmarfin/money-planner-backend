import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateConsumptionDto {
  @IsNotEmpty()
  @IsNumber()
  sum: number;

  @IsNotEmpty()
  @IsNumber()
  date: number;
}
