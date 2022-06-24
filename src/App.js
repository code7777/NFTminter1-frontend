import './styles/App.css';
import powerButton from './assets/power-button.svg';
import React, { useEffect , useState} from "react";
import { ethers } from "ethers";
import myEpicNft from './utils/MyEpicNFT.json';
import { Dots } from 'loading-animations-react';


// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

//contract may 12th
const CONTRACT_ADDRESS = "0x0F8f7558cc328806E792B45f9611Fbb491DEcf9d";

const App = () => 
{

    /*
    * Just a state variable we use to store our user's public wallet. Don't forget to import useState.
    */
    const [currentAccount, setCurrentAccount] = useState("");
    
    /*
    * First make sure we have access to window.ethereum
    */
    const checkIfWalletIsConnected = async () => 
    {
      <Dots text="Minting..." />
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      /* inform user to use rinkeby*/
      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);

      // String, hex code of the chainId of the Rinkebey test network
      const rinkebyChainId = "0x4"; 
      if (chainId !== rinkebyChainId) {
        alert("You are not connected to the Rinkeby Test Network!");
      }

      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: 'eth_accounts' });

      /*
      * User can have multiple authorized accounts, we grab the first one if its there!
      */
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        // Setup listener! This is for the case where a user comes to our site
        // and ALREADY had their wallet connected + authorized.
        setupEventListener()
      } else {
        console.log("No authorized account found");
      }

    }//check if wallet is connected
  
    /*
  * Implement your connectWallet method here
  */
    const connectWallet = async () => 
    {
      try {
        const { ethereum } = window;
  
        if (!ethereum) {
          alert("Get MetaMask!");
          return;
        }
  
        /*
        * Fancy method to request access to account.
        */
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  
        /*
        * Boom! This should print out public address once we authorize Metamask.
        */
        console.log("Connected", accounts[0]);
        setCurrentAccount(accounts[0]); 
        // Setup listener! This is for the case where a user comes to our site
        // and connected their wallet for the first time.
        setupEventListener() 
      } catch (error) {
        console.log(error);
      }
    }

    // Setup our listener.
    const setupEventListener = async () => 
    {
    // Most of this looks the same as our function askContractToMintNft
    try 
      {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")

        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log(error)
      }
    }

    const askContractToMintNft = async () => 
    {


      try 
      {

        const { ethereum } = window;
    
        if (ethereum) 
        {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const connectedContract = new ethers.Contract( CONTRACT_ADDRESS, myEpicNft.abi, signer);
          console.log("Going to pop wallet now to pay gas...")
          let nftTxn = await connectedContract.makeAnEpicNFT();
          <Dots text="Minting..." /> 
          console.log("Mining...please wait.")
          await nftTxn.wait();
          
          console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
    
        } else 
          {
          console.log("Ethereum object doesn't exist!");
          }
      } catch (error) {
        console.log(error)
      }
    }
  // Render Methods
  const renderNotConnectedContainer = () => 
  (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

    /*
  * This runs our function when the page loads.
  */
    useEffect(() => 
    {
      checkIfWalletIsConnected();
    }, []); 

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">United Blockchain Group NFT Minter</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <button onClick={ askContractToMintNft} className="cta-button connect-wallet-button">
              Mint NFT
            </button>
          )}
        </div>
        <div className= "instructions">
            <p>
              To use the NFT minter you must have an EVM based cryptocurrency wallet installed in your browser such as metamask. <br></br>If you do not have a 
              an EVM based cryptocurrency wallet go to <br></br>  https://metamask.io/download/ to download metamask. 
              <br></br>
              <br></br>
              Make sure you have enough Rinkeby testnet ETH in your account to cover gas fees. <br></br> If you do not have enough funds you can get test ETH from a faucet. <br></br> 
              Connect to your wallet using a ETH testnet and then click Mint NFT. <br></br> <br></br>
              
              You can see the deployed contract at  https:///rinkeby.etherscan.io/contract_address <br></br>
              You can see the NFT at https://testnets.opensea.io/assets/contract_address/tokenID . <br></br> The tokenID will be the number of a NFT printed out.  <br></br> 
              For example the first NFT you mint will be token 0 . The second NFT will be token 1 . 
              <br></br>
              <br></br>
              You can print as many NFTs as you like. <br></br> The NFTs
              created from the minter will be <br></br> a combination of 3 words and a random colored background , generated psuedo-randomly. 
              <br></br>
              <br></br>
              Here are examples <br></br>
              example contracts: https://rinkeby.etherscan.io/txs?a=0xAbacE65E815e9524995016dA216617ac98c57577 <br></br>
              example NFTs: https://testnets.opensea.io/assets/rinkeby/0x0F8f7558cc328806E792B45f9611Fbb491DEcf9d/0 <br></br>

            </p>
        </div>
        <div className="footer-container">


          <a
            className="footer-text"
            target="_blank"
            rel="noreferrer"
          >{`affiliated with  United Blockchain Group`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
