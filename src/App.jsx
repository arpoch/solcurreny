import { clusterApiUrl, Connection } from '@solana/web3.js';
import { useState } from 'react';
import AirDrop from './AirDrop';
import './App.css';
import Balance from './Balance';
import CapToken from './CapToken';
import MintAgain from './MintAgain';
import MintToken from './MintToken';
import Transfer from './Transfer';

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [provider, setProvider] = useState();
  const [connection, setConnection] = useState(() => {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    return connection;
  });
  const [isTokenCreated, setIsTokenCreated] = useState(false);
  const [createdTokenPublicKey, setCreatedTokenPublicKey] = useState(null);
  const [mintingWalletSecretKey, setMinitingWalletSecretKey] = useState(null);

  const [supplyCapped,setSupplyCapped] = useState(false);
  const [loading, setLoading] = useState();

  const getProvider = async () => {
    if ("solana" in window) {
      const provider = window.solana;
      if (provider.isPhantom) {
        return provider;
      }
    }
    window.open("https://www.phantom.app/", "_blank");
  }
  async function walletConnectionHelper() {
    if (walletConnected) {
      await provider.disconnect();
      setProvider(null);
      setWalletConnected(false);
      return;
    }
    const wallet = await getProvider();
    if (wallet) {
      await wallet.connect();
      setProvider(wallet);
      setWalletConnected(true);
    }
    return;
  }



  return (
    <>
      <h1>Create your own javascript token</h1>
      {
        walletConnected && provider
          ? <>
            <p>Public key:{provider.publicKey.toString()}</p>
            <Balance connection={connection} provider={provider}/>
          </>
          : <></>
      }

      <button onClick={walletConnectionHelper} disabled={loading}>
        {!walletConnected ? "Connect Wallet" : "Disconnect"}
      </button>

      {
        walletConnected && provider
          ?
          <ul>
            <AirDrop 
            connection={connection} 
            provider={provider}
            setLoading={setLoading}
            loading={loading}
            />
            <MintToken 
              connection={connection} 
              provider={provider}
              setIsTokenCreated={setIsTokenCreated}
              setCreatedTokenPublicKey={setCreatedTokenPublicKey}
              setMinitingWalletSecretKey={setMinitingWalletSecretKey}
              setLoading={setLoading}
              loading={loading}
            />
            <MintAgain 
            provider={provider}
            connection={connection}
            createdTokenPublicKey={createdTokenPublicKey}
            isTokenCreated={isTokenCreated}
            mintingWalletSecretKey={mintingWalletSecretKey}
            setLoading={setLoading}
            loading={loading}
            supplyCapped={supplyCapped}
            />
            <Transfer
              connection={connection}
              provider={provider}
              createdTokenPublicKey={createdTokenPublicKey}
              isTokenCreated={isTokenCreated}
              mintingWalletSecretKey={mintingWalletSecretKey}
              setLoading={setLoading}
              loading={loading}
            />
            <CapToken
              connection={connection}
              mintingWalletSecretKey={mintingWalletSecretKey}
              createdTokenPublicKey={createdTokenPublicKey}
              isTokenCreated={isTokenCreated}
              setLoading={setLoading}
              setSupplyCapped={setSupplyCapped}
              loading={loading}
              supplyCapped={supplyCapped}
            />
          </ul>
          : <></>
      }

    </>
  );
}

export default App;
