// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event DonationReceived(address sender, uint256 amount);
    event FundsTransferred(address sender, address recipient, uint256 amount);
    event BillPaid(address indexed payer, uint256 indexed billId, uint256 amount);

    constructor(uint256 initBalance) payable {
        owner = msg.sender;
        balance = initBalance;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can perform this action");
        _;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        balance += _amount;
        emit Deposit(_amount);
    }

    function withdraw(uint256 _withdrawAmount) public onlyOwner {
        require(balance >= _withdrawAmount, "Insufficient contract balance");
        balance -= _withdrawAmount;
        emit Withdraw(_withdrawAmount);
    }

    function increaseBalance(uint256 amount) public onlyOwner {
        balance += amount;
        emit Deposit(amount);
    }

    function decreaseBalance(uint256 amount) public onlyOwner {
        require(balance >= amount, "Cannot decrease balance by more than the current balance");
        balance -= amount;
        emit Withdraw(amount);
    }

    function transferFunds(address payable recipient, uint256 amount) public onlyOwner {
        require(recipient != address(0), "Invalid recipient address");
        require(amount <= balance, "Insufficient contract balance");
        recipient.transfer(amount);
        emit FundsTransferred(msg.sender, recipient, amount);
    }

    function payBill(uint256 billId) public payable {
        require(billId >= 0 && billId < 3, "Invalid billId"); // Assuming there are 3 bills to pay
        uint256 billAmount = getBillAmount(billId);
        require(msg.value == billAmount, "Incorrect payment amount");
        address payable billRecipient = getBillRecipient(billId);
        billRecipient.transfer(msg.value);
        emit BillPaid(msg.sender, billId, msg.value);
        balance -= billAmount;
    }

    // Helper functions for bills (You can customize these as per your requirements)
    function getBillAmount(uint256 billId) public pure returns (uint256) {
        if (billId == 0) {
            return 0.5 ether; // Electric Bill (0.5 ETH)
        } else if (billId == 1) {
            return 0.3 ether; // Internet Bill (0.3 ETH)
        } else if (billId == 2) {
            return 1 ether; // Rent (1 ETH)
        }
        revert("Invalid billId");
    }

    function getBillRecipient(uint256 billId) public view returns (address payable) {
        if (billId == 0) {
            return payable(0x1111111111111111111111111111111111111111); // Replace with the Electric Bill recipient address
        } else if (billId == 1) {
            return payable(0x2222222222222222222222222222222222222222); // Replace with the Internet Bill recipient address
        } else if (billId == 2) {
            return payable(0x3333333333333333333333333333333333333333); // Replace with the Rent recipient address
        }
        revert("Invalid billId");
    }
}
