pragma solidity ^0.6.0;

import "./interfaces/IERC20.sol";

contract Mstable {
    // mUSD Address: 0x752fC0b67FFB55e2261970feaC7223d8657cbF79
    // mUSD SAVE Address: 0xa4e196CB0b83a0a4F1859Ebf0E344c113FEeb
    address internal tokenAddress = 0x752fC0b67FFB55e2261970feaC7223d8657cbF79;
    address internal saveAddress = 0xa4e196CB0b83a0a4F1859Ebf0E344c113FEeb754;

    receive() external payable {}

    function deposit(uint256 amount) internal returns (bool) {
        // Approve SAVE contract to use your mUSD
        IERC20(tokenAddress).approve(saveAddress, amount);

        // Deposit amount to saving pool
        ISavingsContract(saveAddress).depositSavings(amount);

        return true;
    }

    function withdraw(uint256 amount) internal returns (bool) {
        // Withdraw Token for saving pool
        ISavingsContract(saveAddress).redeem(amount);

        return true;
    }

    function getPoolBalance() public view returns (uint256) {
        return ISavingsContract(saveAddress).creditBalances(address(this));
    }
}

interface ISavingsContract {
    /** @dev Manager privs */
    function depositInterest(uint256 _amount) external;

    /** @dev Saver privs */
    function depositSavings(uint256 _amount)
        external
        returns (uint256 creditsIssued);

    function redeem(uint256 _amount) external returns (uint256 massetReturned);

    /** @dev Getters */
    function exchangeRate() external view returns (uint256);

    function creditBalances(address) external view returns (uint256);
}
