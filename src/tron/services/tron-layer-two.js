// address 2 has some test token named mikuk with contract address TKnU44VqE65XJSy8RYNDVKc1JMuuhwKY7C
// at first you have to send some trx to address 2 to call approve
// call approve function to approve address 1 uses address 2 tokens
// call transfer from to move tokens from address 2 to address 3 and sign it with address 1 private key
const TronWeb = require('tronweb');
const tronWeb = new TronWeb({
    fullHost: 'https://api.shasta.trongrid.io',
    headers: { 'TRON-PRO-API-KEY': '5edf3502-96d0-4b96-a29d-195c4d7febb2' },
    privateKey:
      'aca0daace95d60abe451de89cc52248681ef15cfda40d879b173e6092922d301',
});
const maxUint = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

const address1 = "TDH3x7axzi3zfQYh9CRMDWWosVLSENFp65";
const address2 = "TDt7H6e43B25MXV2BwbAzBJS9hKuziuk3t";
const address3 = "TV1d8gQQvyJpasB9aH3o1yEtVD7EADLsd6";

const prv1 = "fbadf6c6bbc6204230c08b00e25b5fa3dc49c259379fd3df045b6dbe83eae3"; // private key for address 1
const prv2 = "56073aa115d8c6c33c252b99084d14dd8aa2a6f16881c3638edea89077af6097"; // private key for address 2

const options = {
    feeLimit: 6 * 1000 * 1000,
    callValue: 0,
};

const Approve = async () => {

    const contractAddress = await tronWeb.address.toHex("TKnU44VqE65XJSy8RYNDVKc1JMuuhwKY7C");  
    const parameter = [
        { type: 'address', value: address1 },
        { type: 'uint256', value: maxUint }];
    const contractFunc = 'approve(address,uint256)';
    tx = await tronWeb.transactionBuilder.triggerSmartContract(
        contractAddress,
        contractFunc,
        options,
        parameter,
        tronWeb.address.toHex(address2)
    );
    const signed = await tronWeb.trx.sign(tx.transaction,prv2);
    const receipt = await tronWeb.trx.sendRawTransaction(signed);
    console.log('approve txid: ', receipt.txid);
}
// Approve();

const TransferFrom = async (volume) => {
    const contractAddress = await tronWeb.address.toHex("TKnU44VqE65XJSy8RYNDVKc1JMuuhwKY7C");
    const parameter = [
        { type: 'address', value: address2 },
        { type: 'address', value: address3 },
        { type: 'uint256', value: volume },
      ];
    const contractFunc = 'transferFrom(address,address,uint256)';
    tx = await tronWeb.transactionBuilder.triggerSmartContract(
        contractAddress,
        contractFunc,
        options,
        parameter,
        tronWeb.address.toHex(address1)
    );
    const signed = await tronWeb.trx.sign(tx.transaction,prv1);
    // console.log(signed);
    const receipt = await tronWeb.trx.sendRawTransaction(signed);
    console.log(receipt.txid);
}
TransferFrom(10);
