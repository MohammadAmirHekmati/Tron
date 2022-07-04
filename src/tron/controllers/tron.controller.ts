import { Body, Controller, GatewayTimeoutException, Get, Param, Post } from '@nestjs/common';
import { TronService } from '../services/tron.service';
import { GetTrc20BalanceDto } from '../dto/get-trc-20-balance.dto';
import { TransferTrc20Dto } from '../dto/transfer-trc20.dto';

@Controller('tron')
export class TronController {
  constructor(private tronService:TronService)
  {}

  @Get("check/chain")
  async isChainOk():Promise<any>
  {
    return await this.tronService.isChainOk()
  }

  @Get("check/transaction/:txId")
  async checkTransaction(@Param("txId") txId:string):Promise<any>
  {
    return await this.tronService.checkTransaction(txId)
  }

  @Get("wallet/balance/:address")
  async getWalletBalance(@Param("address") walletAddress:string):Promise<any>
  {
    return await this.tronService.getWalletBalance(walletAddress)
  }

  @Get("generate/wallet")
  async createAccont():Promise<any>
  {
    return await this.tronService.createAccont()
  }

  @Post("trc20/balance")
  async getTrc20Balance(@Body() getTrc20BalanceDto:GetTrc20BalanceDto):Promise<any>
  {
    return await this.tronService.getTrc20Balance(getTrc20BalanceDto)
  }

  @Post("contract/transfer/:contract")
  async contractTransfer(@Body() transferTrc20Dto:TransferTrc20Dto,@Param("contract") contractAddress:string):Promise<any>
  {
    return await this.tronService.contractTransfer(transferTrc20Dto, contractAddress)
  }

  @Get("trongrid/test")
  async checkTronGrid():Promise<any>
  {
    return await this.tronService.checkTronGrid()
  }
}
