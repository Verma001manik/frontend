import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [selectedBillId, setSelectedBillId] = useState(null);
  const [billAmount, setBillAmount] = useState(0);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  
  const [newOwnerAddress, setNewOwnerAddress] = useState("");
  const [counter, setCounterValue] = useState(0); // New state variable for the counter
  const [contractOwner, setContractOwner] = useState(""); // Updated state variable for the contract owner's address
  const contractAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
  const atmABI = atm_abi.abi;

  
  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async () => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }

    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);

    // Once the wallet is set, get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  // const getBalance = async () => {
  //   if (atm) {
  //     const balanceBigNumber = await atm.getBalance();
  //     setBalance(balanceBigNumber.toString());
  //   }
  // };
  const getBalance = async () => {
    if (atm) {
      const balanceBigNumber = await atm.getBalance();
      const balanceInEther = ethers.utils.formatEther(balanceBigNumber);
      const formattedBalance = parseFloat(balanceInEther).toFixed(2);
      setBalance(formattedBalance);
    }
  };
  
  
  

  const deposit = async () => {
    if (atm) {
      const tx = await atm.deposit(ethers.utils.parseEther("1"));
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      const tx = await atm.withdraw(ethers.utils.parseEther("1"));
      await tx.wait();
      getBalance();
    }
  };

  async function transferFunds(recipientAddress, amount) {
    try {
      const contractBalance = await atm.getBalance();
      if (amount <= contractBalance) {
        const tx = await atm.transferFunds(
          ethers.utils.getAddress(recipientAddress),
          ethers.utils.parseEther(amount.toString())
        );
        await tx.wait();
        setBalance((prevBalance) => {
          const newBalance = ethers.utils.formatEther(prevBalance.sub(amount));
          return newBalance;
        });
        console.log("Transaction successful!");
      } else {
        console.error("Insufficient contract balance");
      }
    } catch (error) {
      console.error("Error transferring funds:", error);
    }
  }

 
  const handleBillSelect = (billId, amount) => {
    setSelectedBillId(billId);
    setBillAmount(amount);
    setTransactionSuccess(false); // Reset transaction success message
  };

  const payBill = async () => {
    if (atm && parseFloat(billAmount) > 0) {
      try {
        // Send the transaction to pay the selected bill
        const tx = await atm.payBill(selectedBillId, { value: ethers.utils.parseEther(billAmount.toString()) });
        await tx.wait();

        // Update balance after successful payment
        getBalance();

        // Show transaction success message
        setTransactionSuccess(true);
      } catch (error) {
        console.error("Error paying bill:", error);
      }
    }
  };
  const increaseCounter = async () => {
    if (atm) {
      let tx = await atm.increaseCounter();
      await tx.wait();
      // Fetch the updated value of the counter from the contract
      const counter = await atm.counter();
      setCounterValue(counter.toNumber());
    }
  };
  

  // Function to decrease the counter
  const decreaseCounter = async () => {
    if (atm) {
      let tx = await atm.decreaseCounter();
      await tx.wait();
      // Fetch the updated value of the counter from the contract
      const counter = await atm.counter();
      setCounterValue(counter.toNumber());
    }
  };
  

  // Function to make a donation
  const donate = async () => {
    if (atm) {
      const donationAmount = ethers.utils.parseEther("0.1"); // You can change the donation amount here
      const tx = await atm.donate({ value: donationAmount });
      await tx.wait();
      console.log("Donation received!");
      getDonationTotal();
    }
  };

  // Function to get the total donations
  const getDonationTotal = async () => {
    if (atm) {
      const totalDonations = await atm.getDonationTotal();
      console.log("Total donations:", totalDonations.toString());
    }
  };
  const getContractOwner = async () => {
    try {
      const ownerAddress = await atm.owner();
      setContractOwner(ownerAddress);
    } catch (error) {
      console.error("Error fetching contract owner:", error);
    }
  };

  // Function to set a new owner
  const setNewOwner = async () => {
    if (atm && newOwnerAddress) {
      try {
        const tx = await atm.setNewOwner(newOwnerAddress);
        await tx.wait();
  
        // Show transaction success message
        setTransactionSuccess(true);
      } catch (error) {
        console.error("Error setting new owner:", error);
      }
    }
  };
  const deposit100ETH = async () => {
    if (atm) {
      const tx = await atm.deposit(ethers.utils.parseEther("100"));
      await tx.wait();
      getBalance();
    }
  };

  const withdraw50ETH = async () => {
    if (atm) {
      const tx = await atm.withdraw(ethers.utils.parseEther("50"));
      await tx.wait();
      getBalance();
    }
  };

  
  useEffect(() => {
    getWallet();
  }, []);
 

  if (!ethWallet) {
    return <p>Please install Metamask in order to use this ATM.</p>;
  }

  if (!account) {
    return <button onClick={connectAccount}>Please connect your Metamask wallet</button>;
  }

  if (balance === undefined) {
    getBalance();
  }

  return (
    <main className="container">
      <header><h1>Welcome to Solution!</h1></header>
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance} ETH</p>
        <button onClick={deposit}>Deposit 1 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>
        <button onClick={deposit100ETH}>Deposit 100 ETH</button> {/* New button */}
        <button onClick={withdraw50ETH}>Withdraw 50 ETH</button> {/* New button */}
      </div>
      <div>
        <h2>Contract Owner</h2>
        <div>
        <button onClick={getContractOwner}>Fetch Contract Owner</button>
          <p>Contract Owner: {contractOwner}</p> {/* Display the contract owner's address */}
          <div>
            <input
              type="text"
              placeholder="Enter New Owner Address"
              value={newOwnerAddress}
              onChange={(e) => setNewOwnerAddress(e.target.value)}
            />
            <button onClick={setNewOwner}>Change Owner</button>
          </div>
        </div>
      
      </div>

      <div>
        <h2>Pay Bills</h2>
        <ul>
          <li>
            <button onClick={() => handleBillSelect(0, 0.5)}>Pay Electric Bill (0.5 ETH)</button>
          </li>
          <li>
            <button onClick={() => handleBillSelect(1, 0.3)}>Pay Internet Bill (0.3 ETH)</button>
          </li>
          <li>
            <button onClick={() => handleBillSelect(2, 1)}>Pay Rent (1 ETH)</button>
          </li>
        </ul>
        {selectedBillId !== null && (
          <div>
            <p>Selected Bill: {selectedBillId}</p>
            <p>Amount: {billAmount} ETH</p>
            <button onClick={payBill}>Pay Bill</button>
            {transactionSuccess && <p>Bill payment successful!</p>}
          </div>
        )}
      </div>
      <div>
      <h2>Counter</h2>
      <p>Counter: {counter}</p>
      <button onClick={increaseCounter}>Increase Counter</button>
      <button onClick={decreaseCounter}>Decrease Counter</button>
    </div>
    <div>
      <h2>Donations</h2>
      <button onClick={donate}>Donate 0.1 ETH</button>
      <button onClick={getDonationTotal}>Get Total Donations</button>
    </div>
   
      <style jsx>{`
        .container {
          text-align: center
        }
      `}
      </style>
    </main>
  );
}
