import { ethers } from "ethers";
import { createContext, useEffect, useState } from "react";
import { contractAddress, contractABI } from "../utils/connect";

export const TransactionContext = createContext();

const { ethereum } = window;

// スマートコントラクトを取得
const getSmartContract = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  console.log(provider, signer, transactionContract);

  return transactionContract;
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [inputFormData, setInputFormData] = useState({
    addressTo: "",
    amount: "",
  });

  const handleChange = (e, name) => {
    setInputFormData((prevInputFormData) => ({
      ...prevInputFormData,
      [name]: e.target.value,
    }));
  };

  // メタマスクウォレットと連携しているのかをまずは確認しよう
  const checkMetamaskWallectConnected = async () => {
    if (!ethereum) return alert("メタマスクをインストールしてください");

    // メタマスクのアカウントIDを取得
    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log(accounts);
  };

  // メタマスクウォレットと連携する
  const connectWallet = async () => {
    if (!ethereum) return alert("メタマスクをインストールしてください");

    // メタマスクを持っていれば接続を開始する
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    console.log(accounts[0]);

    setCurrentAccount(accounts[0]);
  };

  // 実際に通貨のやり取りをする
  const sendTransaction = async () => {
    if (!ethereum) return alert("メタマスクをインストールしてください");
    console.log("sendTransaction");
    const { addressTo, amount } = inputFormData;

    const transactionContract = getSmartContract();
    const parsedAmount = ethers.utils.parseEther(amount);

    const transactionParameters = {
      gas: "0x2710",
      to: addressTo,
      from: currentAccount,
      value: parsedAmount._hex,
    };

    const txHash = await ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });

    const transactionHash = await transactionContract.addToBlockChain(
      addressTo,
      parsedAmount
    );
    console.log(`ロード中・・・${transactionHash.hash}`);
    await transactionHash.wait();
    console.log(`送金に成功！${transactionHash.hash}`);
  };

  useEffect(() => {
    checkMetamaskWallectConnected();
  }, []);

  return (
    <TransactionContext.Provider
      value={{ connectWallet, sendTransaction, handleChange, inputFormData }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
