import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";

export default function MintAgain({ connection, provider, isTokenCreated,
    mintingWalletSecretKey, createdTokenPublicKey,
    setLoading, loading, supplyCapped }) {

    const mintAgainHelper = async () => {
        try {
            setLoading(true);
            const createMintingWallet = await Keypair.fromSecretKey(Uint8Array.from(
                Object.values(JSON.parse(mintingWalletSecretKey))));
            const mintRequester = await provider.publicKey;
            
            const fromAirDropSignature = await connection.requestAirdrop(createMintingWallet.publicKey, LAMPORTS_PER_SOL);
            await connection.confirmTransaction(fromAirDropSignature, 'confirmed');
            
            const creatorToken = new Token(connection, createdTokenPublicKey, TOKEN_PROGRAM_ID, createMintingWallet);
            const fromTokenAccount = await creatorToken.getOrCreateAssociatedAccountInfo(createMintingWallet.publicKey);
            const toTokenAccount = await creatorToken.getOrCreateAssociatedAccountInfo(mintRequester);
            await creatorToken.mintTo(fromTokenAccount.address,createMintingWallet.publicKey, [], 100000000);
            
            const transaction = new Transaction().add(
                Token.createTransferInstruction(
                    TOKEN_PROGRAM_ID,
                    fromTokenAccount.address,
                    toTokenAccount.address,
                    createMintingWallet.publicKey,
                    [],
                    100000000
                )
            );
            await sendAndConfirmTransaction(connection, transaction, [createMintingWallet], 'confirmed');
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

    return (
        <>
            {
                isTokenCreated ?
                    <li>
                        Mint More 100 tokens: <button disabled={loading||supplyCapped} onClick={mintAgainHelper}>Mint Again</button>
                    </li>
                    : <></>
            }
        </>
    );
}