import { ApiProperty } from '@nestjs/swagger';

export class GetTrc20BalanceDto {
  @ApiProperty()
  contractaddress:string

  @ApiProperty()
  tronaddress:string

}