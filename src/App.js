import { useEffect, useState } from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { loadContract } from './utils/loadContract';
import './App.css';

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null
  });

  const [account, setAccount] = useState(null);

  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      const contract = await loadContract("Faucet", provider);

      if (!provider) {
        console.log('Install metamask!');
        return;
      }

      provider.request({method: 'eth_requestAccounts'});
      setWeb3Api({
        provider,
        web3: new Web3(provider),
        contract
      });
    }

    loadProvider();
  }, []);

  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api;
      const balance = await web3.eth.getBalance(contract.address);
      setBalance(web3.utils.fromWei(balance, 'ether'));
    }

    web3Api.contract && loadBalance();
  }, [web3Api]);

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    }

    web3Api.web3 && getAccount();
  }, [web3Api.web3]);

  return (
    <>
      <div className='faucet-wrapper'>
        <div className='faucet'>
          <div className='account-wrapper'>
            <span>
              <strong className='mr-2 mb-2'>Account: </strong>
            </span>
            {account ? 
              account : 
              <button 
              className='button is-small' 
              onClick={() => {web3Api.provider.request({method: 'eth_requestAccounts'})}}
              >
                Connect Wallet
              </button>
            }
          </div>
          <div className='balance-view is-size-2 mr-2 mb-2'>
            Current Balance: <strong className='mr-2'>{balance}</strong>ETH
          </div>
          <div className='buttons-wrapper'>
            <button className='button is-success is-light mr-2'>Donate</button>
            <button className='button is-danger is-light'>Withdraw</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
