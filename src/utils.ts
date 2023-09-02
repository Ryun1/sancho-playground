import * as CSL from "@emurgo/cardano-serialization-lib-nodejs"
import {randomBytes} from 'crypto'

export const harden = (num) => {
    return 0x80000000 + num;
};

// Add an example DRep Registration Certificate to the builder
export const regDRepCertExample = (certBuilder: CSL.CertificatesBuilder, dRepKeyHash: CSL.Ed25519KeyHash) => {
    // Will change from a StakeCredential in future iterations of the lib
    const dRepCred = CSL.Credential.from_keyhash(dRepKeyHash);

    // Make an example metadata anchor, using my github example
    const dataHash = CSL.AnchorDataHash.from_hex("9bba8233cdd086f0325daba465d568a88970d42536f9e71e92a80d5922ded885");
 // const url = CSL.URL.new("https://raw.githubusercontent.com/Ryun1/gov-metadata/main/governace-action/metadata.jsonld");
    const url = CSL.URL.new("example.com");
    const anchor = CSL.Anchor.new(url, dataHash);

    // Create cert object using one Ada as the deposit
    const dRepRegCert = CSL.DrepRegistration.new_with_anchor(
        dRepCred,
        CSL.BigNum.from_str("1000000"),
        anchor
    );

    // adding certificate without required script witness
    certBuilder.add(CSL.Certificate.new_drep_registration(dRepRegCert));

    // console.log("Create Example DRep Registration Certificate: ");
    // console.log(dRepRegCert.to_json());
    
    return certBuilder;
}

// Add an example DRep retirement Certificate to the builder
export const retireDRepCertExample = (certBuilder: CSL.CertificatesBuilder, dRepKeyHash: CSL.Ed25519KeyHash) => {
    // Will change from a StakeCredential in future iterations of the lib
    const dRepCred = CSL.Credential.from_keyhash(dRepKeyHash);

    // Create cert object using one Ada as the deposit
    const dRepRetireCert = CSL.DrepDeregistration.new(
        dRepCred,
        CSL.BigNum.from_str("1000000"),
    );

    // adding certificate without required script witness
    certBuilder.add(CSL.Certificate.new_drep_deregistration(dRepRetireCert));

    // console.log("Create Example DRep Registration Certificate: ");
    // console.log(dRepRegCert.to_json());
    
    return certBuilder;
}

// Add an example Vote Delegation Certificate to the builder
export const voteDelegationExample = (certBuilder: CSL.CertificatesBuilder, dRep: CSL.DRep, stakeKeyHash: CSL.Ed25519KeyHash) => {
    
    const stakeCred = CSL.Credential.from_keyhash(stakeKeyHash);

    const voteDelegationCert = CSL.VoteDelegation.new(
        stakeCred,
        dRep,
    );

    // adding certificate
    certBuilder.add(CSL.Certificate.new_vote_delegation(voteDelegationCert));

    // console.log("Create Example Vote Delegation Certificate: ");
    // console.log(voteDelegationCert.to_json());
    
    return certBuilder;
}

export const voteExample = (txBuilder: CSL.TransactionBuilder, dRep: CSL.Ed25519KeyHash, govAction: CSL.Transaction ) => {
    const votingBuilder = CSL.VotingBuilder.new();
    const voter = CSL.Voter.new_drep(
        CSL.Credential.from_keyhash(dRep)
    )

    const govActionId = CSL.GovernanceActionId.new(
        CSL.TransactionHash.from_bytes(randomBytes(32)),
        0
    );

    //you can also use new_with_anchor if you need to specify it
    const votingProcedure = CSL.VotingProcedure.new(CSL.VoteKind.Yes);

    //use add_with_plutus_witness or add_with_native_script if you have required script witness
    votingBuilder.add(voter, govActionId, votingProcedure);

    txBuilder.set_voting_builder(votingBuilder);
}

export const certificateExample = (txBuilder: CSL.TransactionBuilder) => {
    const certBuilder = CSL.CertificatesBuilder.new();

    const drepStakeCred = CSL.Credential.from_keyhash(
        CSL.Ed25519KeyHash.from_bytes(randomBytes(28))
    );
    const dataHash = CSL.AnchorDataHash.from_bytes(randomBytes(32));
    const url = CSL.URL.new("https://example.com");
    const anchor = CSL.Anchor.new(url, dataHash);

    //cert for drep registration
    const drepRegCert = CSL.DrepRegistration.new_with_anchor(
        drepStakeCred,
        CSL.BigNum.from_str("1000000"),
        anchor
    );

    const stakeCred = CSL.Credential.from_keyhash(
        CSL.Ed25519KeyHash.from_bytes(randomBytes(28))
    );

    const drep = CSL.DRep.new_key_hash(
        CSL.Ed25519KeyHash.from_bytes(randomBytes(28))
    );
    const poolKeyHash = CSL.Ed25519KeyHash.from_bytes(randomBytes(28));
    const stakeVoteRegistrationAndDelegationCert =
        CSL.StakeVoteRegistrationAndDelegation.new(
            stakeCred,
            poolKeyHash,
            drep,
            CSL.BigNum.from_str("1000000")
        );

    //adding certificates without required script witness
    certBuilder.add(CSL.Certificate.new_drep_registration(drepRegCert));
    certBuilder.add(CSL.Certificate.new_stake_vote_registration_and_delegation(stakeVoteRegistrationAndDelegationCert));

    //use certBuilder.add_with_plutus_witness or add_with_native_script if you have required script witness

    txBuilder.set_certs_builder(certBuilder);
}

export const votingExample = (txBuilder: CSL.TransactionBuilder) => {
    const votingBuilder = CSL.VotingBuilder.new();
    const voter = CSL.Voter.new_drep(
        CSL.Credential.from_keyhash(CSL.Ed25519KeyHash.from_bytes(randomBytes(28)))
    )

    const govActionId = CSL.GovernanceActionId.new(
        CSL.TransactionHash.from_bytes(randomBytes(32)),
        0
    );

    //you can also use new_with_anchor if you need to specify it
    const votingProcedure = CSL.VotingProcedure.new(CSL.VoteKind.Yes);

    //use add_with_plutus_witness or add_with_native_script if you have required script witness
    votingBuilder.add(voter, govActionId, votingProcedure);

    txBuilder.set_voting_builder(votingBuilder);
}

export const votingProposalExample = (txBuilder: CSL.TransactionBuilder) => {
    const votingProposalBuilder = CSL.VotingProposalBuilder.new();

    const dataHash = CSL.AnchorDataHash.from_bytes(randomBytes(32));
    const url = CSL.URL.new("https://example.com");
    const anchor = CSL.Anchor.new(url, dataHash);

    //or you can use new_with_script_hash if you need to specify it
    const constitution = CSL.Constitution.new(anchor);

    //or you can use new_with_action_id if you need to specify it
    const newConstitution = CSL.NewConstitutionProposal.new(
        constitution
    );

    //you can use add_with_plutus_witness if you need to provide script witness
    votingProposalBuilder.add(CSL.VotingProposal.new_new_constitution_proposal(
        newConstitution
    ));

    txBuilder.set_voting_proposal_builder(votingProposalBuilder);
}

export const create_rich_builder = () => {
    const builder = CSL.TransactionBuilder.new(
        CSL.TransactionBuilderConfigBuilder.new()
            .fee_algo(CSL.LinearFee.new(CSL.BigNum.from_str('44'),
                CSL.BigNum.from_str('155381')))
            .coins_per_utxo_word(CSL.BigNum.from_str('34482'))
            .pool_deposit(CSL.BigNum.from_str('500000000'))
            .key_deposit(CSL.BigNum.from_str('2000000'))
            //new mandatory config for voting
            .voting_proposal_deposit(CSL.BigNum.from_str('500000000'))
            .ex_unit_prices(
                CSL.ExUnitPrices.new(
                    CSL.UnitInterval.new(CSL.BigNum.from_str('577'),
                        CSL.BigNum.from_str('10000')),
                    CSL.UnitInterval.new(CSL.BigNum.from_str('721'),
                        CSL.BigNum.from_str('10000000')),
                ),
            )
            .max_value_size(5000)
            .max_tx_size(16384)
            .build()
    );

    builder.add_input(
        CSL.Address.from_bech32("addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj83ws8lhrn648jjxtwq2ytjqp"),
        CSL.TransactionInput.new(
            CSL.TransactionHash.from_bytes(randomBytes(32)),
            0
        ),
        CSL.Value.new(CSL.BigNum.from_str('999999999999'))
    )

    return builder;
}
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
