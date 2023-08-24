import * as CSL from "@emurgo/cardano-serialization-lib-nodejs"
import secrets from 'secrets';
import {generateMnemonic, mnemonicToEntropy} from 'bip39';
import {harden, regDRepCertExample} from './utils';

const generateCredentialsFromMnemonic = (mnemonic: string) => {
    let entropy = mnemonicToEntropy(mnemonic);
    let rootKey = CSL.Bip32PrivateKey.from_bip39_entropy(
        Buffer.from(entropy, 'hex'),
        Buffer.from('')
    );
    const accountKey = (rootKey).derive(harden(1852)).derive(harden(1815)).derive(harden(0));

    return {
        paymentKey: accountKey.derive(0).derive(0).to_raw_key(),
        stakeKey: accountKey.derive(2).derive(0).to_raw_key(),
        dRepKey: accountKey.derive(3).derive(0).to_raw_key(),
        paymentKeyPub: (accountKey.derive(0).derive(0).to_raw_key()).to_public(),
        stakeKeyPub: (accountKey.derive(2).derive(0).to_raw_key()).to_public(),
        dRepKeyPub: (accountKey.derive(3).derive(0).to_raw_key()).to_public(),
    };
};

try {
    // Generate or import a mnemonic
    const credentials =  generateCredentialsFromMnemonic(generateMnemonic());
    //const credentials = generateCredentialsFromMnemonic('enrich mechanic liberty use office candy rug also chest risk stick spot');
    const dRepKeyHash = credentials.dRepKeyPub.hash();

    // Create a new Certificate builder
    const certBuilder = CSL.CertificatesBuilder.new();

    // Create a DRep Registration Certificate and add to the builder
    const dRepCert = regDRepCertExample(certBuilder, dRepKeyHash);

    // Create a Vote Delegation Certificate and delegate to ourselves

} catch (e) {
    console.log(e);
}