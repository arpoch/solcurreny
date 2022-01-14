import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction } from "@solana/web3.js";

export default function Transfer({ connection, mintingWalletSecretKey, isTokenCreated,
    createdTokenPublicKey, provider, setLoading, loading }) {

    const transferTokenHelper = async () => {
        try {
            setLoading(true);
            const createMintingWallet = Keypair.fromSecretKey(Uint8Array.from(Object.values(JSON.parse(mintingWalletSecretKey))));
            const receiverWallet = new PublicKey("5eaFQvgJgvW4rDjcAaKwdBb6ZAJ6avWimftFyjnQB3Aj");

            const fromAirDropSignature = await connection.requestAirdrop
                                                (createMintingWallet.publicKey, LAMPORTS_PER_SOL);
            await connection.confirmTransaction(fromAirDropSignature, { commitment: "confirmed" });

            const creatorToken = new Token(connection, createdTokenPublicKey, TOKEN_PROGRAM_ID, createMintingWallet);
            const fromTokenAccount = await creatorToken.getOrCreateAssociatedAccountInfo(provider.publicKey);
            const toTokenAccount = await creatorToken.getOrCreateAssociatedAccountInfo(receiverWallet);

            const transaction = new Transaction().add(
                Token.createTransferInstruction(
                    TOKEN_PROGRAM_ID,
                    fromTokenAccount.address,
                    toTokenAccount.address,
                    provider.publicKey, [],
                    10000000)
            );

            transaction.feePayer = provider.publicKey;
            let blockhashObj = await connection.getRecentBlockhash();
            console.log("blockhashObj", blockhashObj);
            transaction.recentBlockhash = await blockhashObj.blockhash;

            if (transaction) {
                console.log("Txn created successfully");
             }
             
             let signed = await provider.signTransaction(transaction);
             let signature = await connection.sendRawTransaction(signed.serialize());
             await connection.confirmTransaction(signature);
             setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    return (
        <>
            {
                isTokenCreated ?
                    <li>
                        Transfer tokens: <button disabled={loading} onClick={transferTokenHelper}>Transfer 10 tokens</button>
                    </li>
                    : <></>
            }
        </>
    );
}