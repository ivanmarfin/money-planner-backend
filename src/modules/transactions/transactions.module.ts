import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginMiddleware } from '../../middlewares/login.middleware';
import { TransactionsController } from './controllers/transactions.controller';
import { Income } from './entities/income.entity';
import { TransactionsService } from './services/transactions.service';
import { UsersService } from '../users/services/user.service';
import { User } from '../users/entities/user.entity';
import { Consumption } from './entities/consumption.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Income, User, Consumption])],
  providers: [TransactionsService, UsersService],
  controllers: [TransactionsController],
})
export class TransactionsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoginMiddleware).forRoutes(TransactionsController);
  }
}
