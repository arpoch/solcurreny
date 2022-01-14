import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';


export default function AirDrop({ connection, provider, setLoading, loading }) {
    const airDropHelper = async () => {
        try {
            setLoading(true);
            const pubkey = new PublicKey(provider.publicKey);
            const signature = await connection.requestAirdrop(pubkey, LAMPORTS_PER_SOL);
            await connection.confirmTransaction(signature);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(true);
        }
    }
    return (
        <li>
            Airdrop 1 SOL into your wallet&nbsp;
            <button disabled={loading} onClick={airDropHelper}>AirDrop SOL</button>
        </li>
    );
}