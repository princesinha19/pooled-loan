pragma solidity ^0.6.0;

import "./interfaces/IERC20.sol";

contract Mstable {
    // mUSD Address: 0x70605Bdd16e52c86FC7031446D995Cf5c7E1b0e7
    // mUSD SAVE Address: 0x54Ac0bdf4292F7565Af13C9FBEf214eEEB2d0F87
    address internal tokenAddress = 0x70605Bdd16e52c86FC7031446D995Cf5c7E1b0e7;
    address internal saveAddress = 0x54Ac0bdf4292F7565Af13C9FBEf214eEEB2d0F87;

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
