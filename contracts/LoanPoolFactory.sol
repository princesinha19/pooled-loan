// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
import "./LoanPoolAave.sol";
import "./LoanPoolMstable.sol";

contract LoanPoolFactory {
    uint256 public totalPools;
    address dai = 0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD;
    address mUsd = 0x70605Bdd16e52c86FC7031446D995Cf5c7E1b0e7;

    event NewLoanPool(
        uint256 id,
        address loanPool,
        uint256 collateralAmount,
        uint256 minimumBidAmount,
        uint256 auctionInterval,
        uint256 auctionDuration,
        uint8 maxParticipants,
        address tokenAddress,
        string lendingPool,
        address creator,
        uint256 createdAt
    );

    function addLoanPool(
        uint256 maximumBidAmount,
        uint256 minimumBidAmount,
        uint256 auctionInterval,
        uint256 auctionDuration,
        uint8 maxParticipants,
        address token
    ) public {
        address loanPool;

        if (token == dai) {
            LoanPoolAave newLoanPool = new LoanPoolAave(
                maximumBidAmount,
                minimumBidAmount,
                auctionInterval,
                auctionDuration,
                maxParticipants,
                token
            );

            loanPool = address(newLoanPool);
        } else if (token == mUsd) {
            LoanPoolMstable newLoanPool = new LoanPoolMstable(
                maximumBidAmount,
                minimumBidAmount,
                auctionInterval,
                auctionDuration,
                maxParticipants,
                token
            );

            loanPool = address(newLoanPool);
        }

        totalPools++;

        emit NewLoanPool(
            totalPools,
            loanPool,
            maximumBidAmount * maxParticipants,
            minimumBidAmount,
            auctionInterval,
            auctionDuration,
            maxParticipants,
            token,
            token == dai ? "Aave" : "Mstable",
            msg.sender,
            block.timestamp
        );
    }
}
