import { Module } from '@nestjs/common';
import { TronService } from './services/tron.service';
import { TronController } from './controllers/tron.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TronWalletEntity } from './entities/tron-wallet.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { ContractsTransfersEntity } from './entities/contracts.transfers.entity';

@Module({
  imports:[TypeOrmModule.forFeature([TronWalletEntity,ContractsTransfersEntity]),
  ScheduleModule.forRoot()
  ],
  providers: [TronService],
  controllers: [TronController]
})
export class TronModule {}
