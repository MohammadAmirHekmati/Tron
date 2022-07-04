
export class ContractsWatcherInterface {
  block:number
  timestamp:number
  contract:string
  name:string
  transaction:string
  result:Result
  resourceNode:string
  unconfirmed:boolean
  fingerprint?:string
}

export class Result {
  0:string
  1:string
  2:string
  from:string
  to:string
  value:string
}