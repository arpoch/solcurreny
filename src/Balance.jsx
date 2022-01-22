import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState } from "react";

export default function Balance({ connection, provider }) {
    const [balance, setBalance] = useState(-1);
    const [exRate, setExRate] = useState(144.03);
    const getBalance = async () => {
        const bal = await connection.getBalance(provider.publicKey, 'confirmed')
            .then(val => { return val })
            .catch(err => console.error(err));
        console.log(bal);
        setExRate(144.03);
        setBalance(bal / LAMPORTS_PER_SOL * exRate);
    };
    getBalance();
    return (
        <>
            {
                balance > 0 ?
                    <p>
                        Balance: {balance}
                    </p>
                    : <p>
                        Balance: loading...
                    </p>
            }
        </>

    );
}