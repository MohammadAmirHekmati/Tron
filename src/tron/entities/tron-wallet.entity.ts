import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name:"crypto_tron_wallet"})
export class TronWalletEntity {
@PrimaryGeneratedColumn("uuid")
  id:string

  @Column()
  address:string

  @Column()
  publicKey:string

  @Column()
  privateKey:string

  @Column()
  hex:string

  @CreateDateColumn({type:"timestamptz"})
  createdAt:Date
}