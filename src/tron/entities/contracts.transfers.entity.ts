import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name:"crypto_tron_contracts_transfers"})
export class ContractsTransfersEntity {
  @PrimaryGeneratedColumn("uuid")
  id:string

  @Column()
  time:string

  @Column()
  contractAddress:string

  @Column({nullable:true})
  contractSymbol:string

  @Column()
  transactionType:string

  @Column()
  txId:string

  @Column()
  from:string

  @Column()
  to:string

  @Column()
  amount:string

  @Column()
  unconfirmed:boolean

  @Column({nullable:true})
  fingerPrint:string
}