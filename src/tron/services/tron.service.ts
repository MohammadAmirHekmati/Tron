import { BadRequestException, Injectable } from '@nestjs/common';
import { CheckTransactionResponse } from '../interfaces/check-transaction.response';
import { CreateWalletResponse } from '../interfaces/create-account.response';
import { TronWalletEntity } from '../entities/tron-wallet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashPublicAndPrivateKeyDto } from '../dto/hash-public-and-private-key.dto';
import { HashedPublicAndPrivateKeyResponse } from '../interfaces/hashed-public-and-private-key.response';
import { GetTrc20BalanceDto } from '../dto/get-trc-20-balance.dto';
import axios from 'axios';
import { GetWalletBalancesResponse } from '../interfaces/get-wallet-balances.response';
import { TransferTrc20Dto } from '../dto/transfer-trc20.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { createEvalAwarePartialHost } from 'ts-node/dist/repl';
import { contractLists, walletAddresses } from '../lists/contract.address';
import { ContractsWatcherInterface } from '../interfaces/contracts-watcher.interface';
import { ContractsTransfersEntity } from '../entities/contracts.transfers.entity';
import { log } from 'util';
import { WalletsAndContractsResponse } from '../interfaces/wallets-and-contracts.response';
import { TransferWithApprovalDto } from '../dto/transfer-with-approval.dto';
const sha256=require("js-sha256")
const TronWeb=require("tronweb")
const TronGrid=require("trongrid")
@Injectable()
export class TronService {

  constructor(@InjectRepository(TronWalletEntity) private tronWalletRepo:Repository<TronWalletEntity>,
              @InjectRepository(ContractsTransfersEntity) private contractsTransfersRepo:Repository<ContractsTransfersEntity>)
  {}

  ADDRESS_NUM_ONE="TDH3x7axzi3zfQYh9CRMDWWosVLSENFp65"
  PRIVATE_KEY_NO_ONE = "fbadf6c6bbc6204230c08b00e25b5fa3dc49c259379fd3df045b6dbe83eae3"

  TEST_NET="https://api.shasta.trongrid.io"
  MAIN_NET="https://api.trongrid.io"
  API_KEY="f56af522-7c65-44a6-a157-652d0181b053"
  tronWeb=new TronWeb({
    fullHost: 'https://api.trongrid.io',
    headers: { "TRON-PRO-API-KEY": `${this.API_KEY}` },
    // privateKey: 'c6540bb90b4e23b19baaa27f01ae829dac59de1fad93a5b49b299c6f8c915246'
  })
  tronGrid=new TronGrid(this.tronWeb)

  async isChainOk():Promise<any>
  {
    const checkChain=await this.tronWeb.isConnected()
    return checkChain
  }

  async balanceWithTrxDecimal(balance:number):Promise<number>
  {
    const balanceWithDecimal=balance/1000000
    return balanceWithDecimal
  }

  async checkTransaction(txId:string):Promise<CheckTransactionResponse>
  {
    const transactionInfo:CheckTransactionResponse=await this.tronWeb.trx.getTransaction(`${txId}`);

    return transactionInfo
  }

  async getWalletBalance(walletAddress:string):Promise<number>
  {
   const checkAddress=await this.addressIsValid(walletAddress)
    if (checkAddress==true)
      throw new BadRequestException(`this is not a Wallet Address`)

    const getWalletBalance=await this.tronWeb.trx.getBalance(`${walletAddress}`);
    const decimaledBalance=await this.balanceWithTrxDecimal(getWalletBalance)
    return decimaledBalance
  }

  async addressIsValid(address:string):Promise<boolean>
  {
   const isAddress=await this.tronWeb.isAddress()
    return isAddress
  }

  async hashPublicAndPrivateKey(hashPublicAndPrivateKeyDto:HashPublicAndPrivateKeyDto):Promise<HashedPublicAndPrivateKeyResponse>
  {
    const hashedPublicKey=hashPublicAndPrivateKeyDto.publicKey+hashPublicAndPrivateKeyDto.key
    const hashPublicKey=await sha256.sha256.create(hashedPublicKey)
    const hashedPrivateKey=hashPublicKey+hashPublicAndPrivateKeyDto.privateKey
    const hashPrivateKey=await sha256.sha256.create(hashedPrivateKey)

    const hashedPublicAndPrivateKeyResponse:HashedPublicAndPrivateKeyResponse=
      {
        publicKey:hashPublicKey,
        privateKey:hashPrivateKey
      }

      return hashedPublicAndPrivateKeyResponse
  }

  async createAccont():Promise<any>
  {
    const createAccont:CreateWalletResponse=await this.tronWeb.createAccount()
    const key=createAccont.address.hex
    const hashPublicAndPrivateKeyDto:HashPublicAndPrivateKeyDto=
      {
        key:key,
        publicKey:createAccont.publicKey,
        privateKey:createAccont.privateKey
      }

      const hashPublicAndPrivateKey:HashedPublicAndPrivateKeyResponse=await this.hashPublicAndPrivateKey(hashPublicAndPrivateKeyDto)

      const tronWalletEntity=new TronWalletEntity()
      tronWalletEntity.address=createAccont.address.base58
      tronWalletEntity.publicKey=hashPublicAndPrivateKey.publicKey
      tronWalletEntity.privateKey=hashPublicAndPrivateKey.privateKey
    tronWalletEntity.hex=createAccont.address.hex
    const savedWallet=await this.tronWalletRepo.save(tronWalletEntity)

    return createAccont
  }

  async getTrc20Balance(getTrc20BalanceDto:GetTrc20BalanceDto):Promise<number>
  {
    // const sendRequest=await axios({method:"GET",url:`https://apilist.tronscan.org/api/accountv2?address=${address}`})
    // const responseData:GetWalletBalancesResponse=sendRequest.data
    // return responseData.withPriceTokens
      const trc20ContractAddress=getTrc20BalanceDto.contractaddress
      const walletAddress=getTrc20BalanceDto.tronaddress

    const {abi} = await this.tronWeb.trx.getContract(trc20ContractAddress);
    this.tronWeb.setPrivateKey('c6540bb90b4e23b19baaa27f01ae829dac59de1fad93a5b49b299c6f8c915246');
    const contract = this.tronWeb.contract(abi.entrys, trc20ContractAddress);
    const balance = await contract.methods.balanceOf(walletAddress).call();
    const resultBalance=balance.toString()
    const parseIntBalance:number=parseInt(resultBalance)
    const getContractDecimal=await this.getContractDecimal(getTrc20BalanceDto.contractaddress)
    const decimal=Math.pow(10,getContractDecimal)
    return parseIntBalance/decimal
  }

  async getContractDecimal(contractAddress:string):Promise<any>
  {
    const {abi}=await this.tronWeb.trx.getContract(contractAddress)
    this.tronWeb.setPrivateKey('c6540bb90b4e23b19baaa27f01ae829dac59de1fad93a5b49b299c6f8c915246');
    const contract=await this.tronWeb.contract(abi.entrys,contractAddress)
    const contractDecimal=await contract.methods.decimals().call()
    return contractDecimal
  }

  async contractTransfer(transferTrc20Dto:TransferTrc20Dto,contractAddress:string):Promise<any>
  {
    const {abi}=await this.tronWeb.trx.getContract(contractAddress)
    this.tronWeb.setPrivateKey('c6540bb90b4e23b19baaa27f01ae829dac59de1fad93a5b49b299c6f8c915246');
    const contract=await this.tronWeb.contract(abi.entrys,contractAddress)
    const transfer=await contract.methods.transferFrom(`${transferTrc20Dto.fromAddress}`,`${transferTrc20Dto.toAddress}`,`${transferTrc20Dto.value}`).send()
    console.log(transfer);
    return transfer
  }

  async findContractSymbol(contractAddress:string):Promise<string>
  {
    const {abi}=await this.tronWeb.trx.getContract(contractAddress)
    this.tronWeb.setPrivateKey('c6540bb90b4e23b19baaa27f01ae829dac59de1fad93a5b49b299c6f8c915246');
    const contract=await this.tronWeb.contract(abi.entrys,contractAddress)
    const contractSymbol=await contract.methods.symbol().call()
    return contractSymbol
  }

  async checkTronGrid():Promise<any>
  {
    const getAccount=this.tronGrid.account.get("TKUyCA7FU71qbMTtwT2bXL6i774ATdwwCk")
    return getAccount
  }

  async turnHexToAddress(hex:string):Promise<string>
  {
    const turnHexToAddress=await this.tronWeb.address.fromHex(hex)
    return turnHexToAddress
  }

  // async contractTransferWatcher()
  // {
  //   for (let address of contractLists) {
  //     let instance = await this.tronWeb.contract().at(address);
  //       const contractSymbol=await this.findContractSymbol(address)
  //     instance["Transfer"]().watch(async (err, eventResult) => {
  //       if (err) {return console.error('Error with "method" event:', err)}
  //       if (eventResult) {
  //         const watcher:ContractsWatcherInterface=eventResult
  //         const saved=await this.saveWatchedTransaction(watcher)
  //         console.log(`Transfer for ${saved.contractSymbol}`);
  //       }})
  //   }
  // }
  // callTransferWatcher=this.contractTransferWatcher()

  // @Cron(CronExpression.EVERY_5_SECONDS)
  // async walletsAndContractsWatcher()
  // {
  //   for (let contractAddress of contractLists) {
  //     for (let walletAddress of walletAddresses) {
  //       const sendRequest=await axios({method:"get",url:`https://api.trongrid.io/v1/accounts/${walletAddress}/transactions/trc20?limit=100&contract_address=${contractAddress}`})
  //       const requestData:WalletsAndContractsResponse=sendRequest.data
  //       console.log(requestData.data);
  //     }
  //   }
  // }
  // callWalletAndContractsWatcher=this.walletsAndContractsWatcher()

  async saveWatchedTransaction(watcher:ContractsWatcherInterface):Promise<ContractsTransfersEntity>
  {
    const contractSymbol=await this.findContractSymbol(watcher.contract)

    const contractsTransfersEntity=new ContractsTransfersEntity()
    contractsTransfersEntity.amount=watcher.result.value
      contractsTransfersEntity.contractAddress=watcher.contract
      contractsTransfersEntity.contractSymbol=contractSymbol
      contractsTransfersEntity.fingerPrint=watcher.fingerprint
      contractsTransfersEntity.from=await this.turnHexToAddress(watcher.result.from)
      contractsTransfersEntity.time=watcher.timestamp.toString()
      contractsTransfersEntity.to=await this.turnHexToAddress(watcher.result.to)
      contractsTransfersEntity.transactionType=watcher.name
      contractsTransfersEntity.txId=watcher.transaction
      contractsTransfersEntity.unconfirmed=watcher.unconfirmed
    const save= await this.contractsTransfersRepo.save(contractsTransfersEntity)
    return save
  }

  async transferWithApproval(transferWithApprovalDto:TransferWithApprovalDto):Promise<any>
  {
    const options = { feeLimit: 6 * 1000 * 1000, callValue: 0, }
    const contractAddress = await this.tronWeb.address.toHex(transferWithApprovalDto.contractAddress);
    const parameter = [
      { type: 'address', value: transferWithApprovalDto.fromAddress },
      { type: 'address', value: transferWithApprovalDto.toAddress },
      { type: 'uint256', value: 2 },
    ]

    const contractFunc = 'transferFrom(address,address,uint256)';
    const transaction = await this.tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress,
      contractFunc,
      options,
      parameter,
      this.tronWeb.address.toHex(this.ADDRESS_NUM_ONE)
    )

    const signed = await this.tronWeb.trx.sign(transaction.transaction,this.PRIVATE_KEY_NO_ONE);
    const receipt = await this.tronWeb.trx.sendRawTransaction(signed);
    console.log(receipt.transaction.raw_data.contract);
  }
}