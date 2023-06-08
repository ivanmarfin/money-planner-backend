import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from '../config/dbConfig';
import { UsersModule } from './modules/users/users.module';
import { TransactionsModule } from './modules/transactions/transactions.module';

@Module({
  imports: [TypeOrmModule.forRoot(dbConfig), UsersModule, TransactionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
