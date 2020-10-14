pragma solidity ^0.6.0;

import "./interfaces/IERC20.sol";

contract Aave {
    address internal tokenAddress;
    address internal aTokenAddress;
    address internal lendingPoolAddress;
    address internal lendingPoolCoreAddress;

    constructor() public {
        // DAI Address: 0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD
        // ADAI Address: 0x58AD4cB396411B691A9AAb6F74545b2C5217FE6a
        // Lending Pool: 0x580D4Fdc4BF8f9b5ae2fb9225D584fED4AD5375c
        // Lending Pool Core: 0x95D1189Ed88B380E319dF73fF00E479fcc4CFa45
        tokenAddress = 0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD;
        aTokenAddress = 0x58AD4cB396411B691A9AAb6F74545b2C5217FE6a;
        lendingPoolAddress = 0x580D4Fdc4BF8f9b5ae2fb9225D584fED4AD5375c;
        lendingPoolCoreAddress = 0x95D1189Ed88B380E319dF73fF00E479fcc4CFa45;
    }

    receive() external payable {}

    function getLendingRate() public view returns (uint256) {
        return
            IAaveLendingPoolCore(lendingPoolCoreAddress)
                .getReserveCurrentLiquidityRate(tokenAddress);
    }

    function getBorrowRate() public view returns (uint256) {
        return
            IAaveLendingPoolCore(lendingPoolCoreAddress)
                .getReserveCurrentStableBorrowRate(tokenAddress);
    }

    function deposit(uint256 amount) internal returns (bool) {
        // Approve LendingPool contract to move your DAI
        IERC20(tokenAddress).approve(lendingPoolCoreAddress, amount);

        // Deposit Token to lending pool
        IAaveLendingPool(lendingPoolAddress).deposit(tokenAddress, amount, 0);

        return true;
    }

    function withdraw(uint256 amount) internal returns (bool) {
        // Withdraw Token for lending pool
        IAToken(aTokenAddress).redeem(amount);

        return true;
    }

    function getPoolBalance() public view returns (uint256) {
        (uint256 balance, , , , , , , , , ) = IAaveLendingPool(
            lendingPoolAddress
        )
            .getUserReserveData(tokenAddress, address(this));

        return balance;
    }
}

interface IAaveLendingPool {
    function deposit(
        address _reserve,
        uint256 _amount,
        uint16 _referralCode
    ) external;

    function getUserReserveData(address _reserve, address _user)
        external
        view
        returns (
            uint256 currentATokenBalance,
            uint256 currentBorrowBalance,
            uint256 principalBorrowBalance,
            uint256 borrowRateMode,
            uint256 borrowRate,
            uint256 liquidityRate,
            uint256 originationFee,
            uint256 variableBorrowIndex,
            uint256 lastUpdateTimestamp,
            bool usageAsCollateralEnabled
        );
}

interface IAaveLendingPoolCore {
    function getReserveCurrentLiquidityRate(address _reserve)
        external
        view
        returns (uint256);

    function getReserveCurrentStableBorrowRate(address _reserve)
        external
        view
        returns (uint256);
}

interface IAToken {
    function redeem(uint256 _amount) external;
}
