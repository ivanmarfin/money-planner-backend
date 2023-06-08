import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './services/user.service';
import { UsersController } from './controllers/users.controller';
import { LoginMiddleware } from '../../middlewares/login.middleware';
import { Income } from '../transactions/entities/income.entity';
import { Consumption } from '../transactions/entities/consumption.entity';
import { TransactionsService } from '../transactions/services/transactions.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Income, Consumption])],
  providers: [UsersService, TransactionsService],
  controllers: [UsersController],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoginMiddleware)
      .forRoutes({ path: 'users', method: RequestMethod.GET });
  }
}
