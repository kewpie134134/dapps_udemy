// スマートコントラクトを実装
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Transactions {
    // 仮想通貨の受け渡しのためのデータ構造
    struct TransferStruct {
        address sender;
        address receiver;
        uint256 amount;
    }

    TransferStruct[] transactions;

    event Transfer(address from, address receiver, uint256 amount);

    function addToBlockChain(address payable receiver, uint256 amount) public {
        transactions.push(TransferStruct(msg.sender, receiver, amount));

        emit Transfer(msg.sender, receiver, amount);
    }
}
