
  export interface Address {
    base58: string;
    hex: string;
  }

  export interface CreateWalletResponse {
    privateKey: string;
    publicKey: string;
    address: Address;
  }


