import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { LAMPORTS_PER_SOL, Keypair, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';


export default function MintToken({provider, connection, setIsTokenCreated, 
                                        setCreatedTokenPublicKey, setMinitingWalletSecretKey,
                                        setLoading, loading }) {
    const initialMintHelper = async () => {
        try {
            setLoading(true);
            const minitRequester = provider.publicKey;
            const minitingFromWallet = await Keypair.generate();
            setMinitingWalletSecretKey(JSON.stringify(minitingFromWallet.secretKey));
            const fromAirDropSignature = await connection.requestAirdrop(minitingFromWallet.publicKey, LAMPORTS_PER_SOL);
            await connection.confirmTransaction(fromAirDropSignature, 'confirmed');

            const creatorToken = await Token.createMint(connection,
                minitingFromWallet,
                minitingFromWallet.publicKey,
                null,
                6,
                TOKEN_PROGRAM_ID);

            const fromTokenAccount = await creatorToken.getOrCreateAssociatedAccountInfo(
                minitingFromWallet.publicKey);
            await creatorToken.mintTo(fromTokenAccount.address, minitingFromWallet, [], 1000000);

            const toTokenAccount = await creatorToken.getOrCreateAssociatedAccountInfo(minitRequester);
            const transaction = new Transaction().add(
                Token.createTransferInstruction(
                    TOKEN_PROGRAM_ID,
                    fromTokenAccount.address,
                    toTokenAccount.address,
                    minitingFromWallet.publicKey,
                    [],
                    1000000
                )
            );
            const signature = await sendAndConfirmTransaction(connection, transaction,
                [minitingFromWallet], { commitment: 'confirmed' });
            console.log("SIGNATURE:", signature);
            setCreatedTokenPublicKey(creatorToken.publicKey);
            setIsTokenCreated(true);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }
    return (
        <li>
            Create your own token
            <button disabled={loading} onClick={initialMintHelper}>Initial Mint </button>
        </li>
    );
}
