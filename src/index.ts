import * as CSL from "@emurgo/cardano-serialization-lib-nodejs"
import {randomBytes} from 'crypto'
import secrets from 'secrets';
import {generateMnemonic, mnemonicToEntropy} from 'bip39';


// Generate or import a mnemonic
// const mnemonic = generateMnemonic();
const mnemonic = 'enrich mechanic liberty use office candy rug also chest risk stick spot';

const harden = (num) => {
    return 0x80000000 + num;
};

const generateCredentialsFromMnemonic = (mnemonic: string) => {
    let entropy = mnemonicToEntropy(mnemonic);
    let rootKey = CSL.Bip32PrivateKey.from_bip39_entropy(
        Buffer.from(entropy, 'hex'),
        Buffer.from('')
    );
    const accountKey = (rootKey).derive(harden(1852)).derive(harden(1815)).derive(harden(0));

    return {
        accountKey,
        paymentKey: accountKey.derive(0).derive(0).to_raw_key(),
        stakeKey: accountKey.derive(2).derive(0).to_raw_key(),
        dRepKey: accountKey.derive(3).derive(0).to_raw_key(),
    };
}


// const certificateExample = (txBuilder: CSL.TransactionBuilder) => {
//     const certBuilder = CSL.CertificatesBuilder.new();

//     const drepStakeCred = CSL.StakeCredential.from_keyhash(
//         CSL.Ed25519KeyHash.from_bytes(randomBytes(28))
//     );
//     const dataHash = CSL.AnchorDataHash.from_bytes(randomBytes(32));
//     const url = CSL.URL.new("https://example.com");
//     const anchor = CSL.Anchor.new(url, dataHash);

//     //cert for drep registration
//     const drepRegCert = CSL.DrepRegistration.new(
//         drepStakeCred,
//         CSL.BigNum.from_str("1000000"),
//         anchor
//     );

//     const stakeCred = CSL.StakeCredential.from_keyhash(
//         CSL.Ed25519KeyHash.from_bytes(randomBytes(28))
//     );

//     const drep = CSL.DRep.new_key_hash(
//         CSL.Ed25519KeyHash.from_bytes(randomBytes(28))
//     );
//     const poolKeyHash = CSL.Ed25519KeyHash.from_bytes(randomBytes(28));
//     const stakeVoteRegistrationAndDelegationCert =
//         CSL.StakeVoteRegistrationAndDelegation.new(
//             stakeCred,
//             poolKeyHash,
//             drep,
//             CSL.BigNum.from_str("1000000")
//         );

//     //adding certificates without required script witness
//     certBuilder.add(CSL.Certificate.new_drep_registration(drepRegCert));
//     certBuilder.add(CSL.Certificate.new_stake_vote_registration_and_delegation(stakeVoteRegistrationAndDelegationCert));

//     //use certBuilder.add_with_plutus_witness or add_with_native_script if you have required script witness

//     txBuilder.set_certs_builder(certBuilder);
// }

// const votingExample = (txBuilder: CSL.TransactionBuilder) => {
//     const votingBuilder = CSL.VotingBuilder.new();
//     const voter = CSL.Voter.new_drep(
//         CSL.StakeCredential.from_keyhash(CSL.Ed25519KeyHash.from_bytes(randomBytes(28)))
//     )

//     const govActionId = CSL.GovernanceActionId.new(
//         CSL.TransactionHash.from_bytes(randomBytes(32)),
//         0
//     );

//     //you can also use new_with_anchor if you need to specify it
//     const votingProcedure = CSL.VotingProcedure.new(CSL.VoteKind.Yes);

//     //use add_with_plutus_witness or add_with_native_script if you have required script witness
//     votingBuilder.add(voter, govActionId, votingProcedure);

//     txBuilder.set_voting_builder(votingBuilder);
// }

// const votingProposalExample = (txBuilder: CSL.TransactionBuilder) => {
//     const votingProposalBuilder = CSL.VotingProposalBuilder.new();

//     const dataHash = CSL.AnchorDataHash.from_bytes(randomBytes(32));
//     const url = CSL.URL.new("https://example.com");
//     const anchor = CSL.Anchor.new(url, dataHash);

//     //or you can use new_with_script_hash if you need to specify it
//     const constitution = CSL.Constitution.new(anchor);

//     //or you can use new_with_action_id if you need to specify it
//     const newConstitution = CSL.NewConstitutionProposal.new(
//         constitution
//     );

//     //you can use add_with_plutus_witness if you need to provide script witness
//     votingProposalBuilder.add(CSL.VotingProposal.new_new_constitution_proposal(
//         newConstitution
//     ));

//     txBuilder.set_voting_proposal_builder(votingProposalBuilder);
// }

// const create_rich_builder = () => {
//     const builder = CSL.TransactionBuilder.new(
//         CSL.TransactionBuilderConfigBuilder.new()
//             .fee_algo(CSL.LinearFee.new(CSL.BigNum.from_str('44'),
//                 CSL.BigNum.from_str('155381')))
//             .coins_per_utxo_word(CSL.BigNum.from_str('34482'))
//             .pool_deposit(CSL.BigNum.from_str('500000000'))
//             .key_deposit(CSL.BigNum.from_str('2000000'))
//             //new mandatory config for voting
//             .voting_proposal_deposit(CSL.BigNum.from_str('500000000'))
//             .ex_unit_prices(
//                 CSL.ExUnitPrices.new(
//                     CSL.UnitInterval.new(CSL.BigNum.from_str('577'),
//                         CSL.BigNum.from_str('10000')),
//                     CSL.UnitInterval.new(CSL.BigNum.from_str('721'),
//                         CSL.BigNum.from_str('10000000')),
//                 ),
//             )
//             .max_value_size(5000)
//             .max_tx_size(16384)
//             .build()
//     );

//     builder.add_input(
//         CSL.Address.from_bech32("addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj83ws8lhrn648jjxtwq2ytjqp"),
//         CSL.TransactionInput.new(
//             CSL.TransactionHash.from_bytes(randomBytes(32)),
//             0
//         ),
//         CSL.Value.new(CSL.BigNum.from_str('999999999999'))
//     )

//     return builder;
// }

// try {
//     const builder = create_rich_builder();
//     votingExample(builder);
//     votingProposalExample(builder);
//     certificateExample(builder);

//     builder.add_change_if_needed(CSL.Address.from_bech32("addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj83ws8lhrn648jjxtwq2ytjqp"));
//     const tx = builder.build_tx();
//     console.log(tx.to_hex());
//     console.log(tx.to_json());

// } catch (e) {
//     console.log(e);
// }


