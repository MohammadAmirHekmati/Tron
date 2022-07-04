
  export interface Ret {
    contractRet: string;
  }

  export interface Value {
    amount?: number;
    asset_name: string;
    owner_address: string;
    to_address: string;
  }

  export interface Parameter {
    value: Value;
    type_url: string;
  }

  export interface Contract {
    parameter: Parameter;
    type: string;
  }

  export interface RawData {
    data: string;
    contract: Contract[];
    ref_block_bytes: string;
    ref_block_hash: string;
    expiration: number;
    fee_limit?:number
    timestamp: number;
  }

  export interface CheckTransactionResponse {
    ret: Ret[];
    signature: string[];
    txID: string;
    raw_data: RawData;
    raw_data_hex: string;
  }

