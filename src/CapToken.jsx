import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function CapToken({ isTokenCreated, mintingWalletSecretKey, connection, createdTokenPublicKey,
    setLoading, setSupplyCapped, loading, supplyCapped }) {
    const capSupplyHelper = async () => {
        try {
            setLoading(true);

            const createMintingWallet = Keypair.fromSecretKey(Uint8Array.from(Object.values(JSON.parse(mintingWalletSecretKey))));
            const fromAirDropSignature = await connection.requestAirdrop(createMintingWallet.publicKey, LAMPORTS_PER_SOL);
            await connection.confirmTransaction(fromAirDropSignature);

            const creatorToken = new Token(connection, createdTokenPublicKey, TOKEN_PROGRAM_ID, createMintingWallet);
            await creatorToken.setAuthority(createdTokenPublicKey, null, "MintTokens", createMintingWallet.publicKey, [createMintingWallet]);

            console.log("Supplu Capped");
            setSupplyCapped(true)
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    }

    return (
        <>
            {
                isTokenCreated
                    ? <li>
                        Cap Token Supply: <button disabled={loading||supplyCapped} onClick={capSupplyHelper}>Cap Supply</button>
                    </li>
                    : <></>
            }
        </>
    )
}