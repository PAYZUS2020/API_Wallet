const BIP39 =  require("bip39");
const { hdkey } = require('ethereumjs-wallet')

const Wallet = require('ethereumjs-wallet')
const keccak256 = require('js-sha3').keccak256;

let { bech32, bech32m } = require('bech32')
let words = bech32.toWords(Buffer.from('91937520f40458f5b414d267961b46c19789dd70', 'hex'))
bech32.encode('bnb', words)
console.log(bech32.encode('bnb', words))


function generateMnemonic(){
    return BIP39.generateMnemonic()
}
function generateHexSeed(mnemonic){
    return BIP39.mnemonicToSeedSync(mnemonic).toString('hex')
}
function generatePrivKey(mnemonic){
    const seed = generateHexSeed(mnemonic)
    return hdkey.fromMasterSeed(seed).derivePath(`m/44'/60'/0'/0`).getWallet().getPrivateKey();
}

function derivePubKey(privKey){
    const wallet = Wallet['default'].fromPrivateKey(privKey);    
    return wallet.getPublicKey()
}



function deriveEthAddress(pubKey){
    const address = keccak256(pubKey) 
    return "0x" + address.substring(address.length - 40, address.length)    
}


module.exports={
    generateMnemonic,
    generatePrivKey,
    derivePubKey,
    deriveEthAddress
}