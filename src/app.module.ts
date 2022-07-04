import { Module } from '@nestjs/common';
import { TronModule } from './tron/tron.module';
import { DatabaseModule } from './database/database.module';


@Module({
  imports: [TronModule, DatabaseModule],

})
export class AppModule {}
