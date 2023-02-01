// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Faucet {

    uint public numOfFunders;
    mapping(uint => address) public funders;

    modifier withdrawLimit(uint256 eth_amount) {
        require(eth_amount < eth_to_wei(10), "Withdraw ammount should be smaller than 10 ETH");
        _;
    }

    receive() external payable {}

    function withdraw(uint256 amount) external withdrawLimit(10) {
        payable(msg.sender).transfer(amount);
    }

    function addFunds() external payable {
        funders[numOfFunders++] = msg.sender;
    }

    function getFundersAt(uint8 index) external view returns(address) {
        return funders[index];
    }

    function getAllFunders() external view returns(address[] memory) {
        address[] memory _funders = new address[](numOfFunders);

        for (uint i = 0; i < numOfFunders; i++) {
            _funders[i] = funders[i];
        }

        return _funders;
    }

    function eth_to_wei(uint256 eth) internal pure returns(uint256) {
        return eth * 1000000000000000000;
    }
}