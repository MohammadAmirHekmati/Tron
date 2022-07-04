export class GetWalletBalancesResponse {
  transactions_out:number
  acquiredDelegateFrozenForBandWidth:number
  rewardNum:number
  ownerPermission:Permissions
  withPriceTokens:TokensWithInfo[]
  delegateFrozenForEnergy:number
  balance:number
  voteTotal:number
  totalFrozen:number
  delegated?:Object
  transactions_in:number
  totalTransactionCount:number
  representative:Reprensentative
  frozenForBandWidth:number
  reward:number
  addressTagLogo:string
  allowExchange?:Object[]
  address:string
  frozen_supply:Object[]
  bandwidth:Object
  date_created:number
  accountType:number
  exchanges?:Object[]
  frozen:Frozen
}

export class Permissions {
  keys:Keys[]
  threshold:number
  permission_name:string
}

export class Keys {
  address:string
  weight:number
}

export class TokensWithInfo {
  amount:number
  tokenPriceInTrx:number
  tokenId:string
  balance:string
  tokenName:string
  tokenDecimal:number
  tokenAbbr:string
  tokenCanShow:number
  tokenType:string
  vip:boolean
  tokenLogo:string
}
export class Reprensentative {
  lastWithDrawTime:number
  allowance:number
  enabled:boolean
  url:string
}
export class Frozen {
  total:number
  balances:[]
}