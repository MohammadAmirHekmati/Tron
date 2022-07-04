import { ApiProperty } from '@nestjs/swagger';

export class TransferTrc20Dto {
  @ApiProperty()
  fromAddress:string

  @ApiProperty()
  toAddress:string

  @ApiProperty()
  value:number
}