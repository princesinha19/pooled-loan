// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./Mstable.sol";
import "./interfaces/IERC20.sol";

contract LoanPoolMstable is Mstable {
    IERC20 public token;
    uint256 public minimumBidAmount;
    uint256 public maxParticipants;
    uint256 public collateralAmount;
    uint256 public poolStartTimestamp;
    uint256 public totalParticipants;
    uint256 public auctionInterval;
    uint256 public auctionDuration;
    uint256 internal loanerCount;

    mapping(address => bool) public isParticipant;
    mapping(uint256 => address) public highestBidder;
    mapping(uint256 => uint256) public highestBidAmount;
    mapping(address => bool) public takenLoan;
    mapping(address => uint256) public loanAmount;

    event NewParticipant(address participant);
    event NewBidder(
        address bidder,
        uint256 amount,
        uint256 term,
        uint256 timestamp
    );
    event ClaimedLoan(address claimer, uint256 amount, uint256 term);
    event ClaimedFinalYield(address participant, uint256 amount);

    constructor(
        uint256 _maximumBidAmount,
        uint256 _minimumBidAmount,
        uint256 _auctionInterval,
        uint256 _auctionDuration,
        uint256 _maxParticipants,
        address _token
    ) public {
        token = IERC20(_token);
        minimumBidAmount = _minimumBidAmount;
        maxParticipants = _maxParticipants;
        auctionInterval = _auctionInterval;
        auctionDuration = _auctionDuration;

        collateralAmount = _maximumBidAmount * _maxParticipants;
        poolStartTimestamp = block.timestamp;
    }

    function participate() external {
        require(
            block.timestamp <= (poolStartTimestamp + auctionInterval * 1 hours),
            "Participation time is over !!"
        );
        require(
            totalParticipants + 1 <= maxParticipants,
            "Exceeds maximum number of participants !!"
        );
        require(
            !isParticipant[msg.sender],
            "You have already participated in the pool !!"
        );
        require(
            token.transferFrom(
                msg.sender,
                address(this),
                collateralAmount * 10**token.decimals()
            ),
            "ERC20: transferFrom failed !!"
        );
        require(
            deposit(collateralAmount * 10**token.decimals()),
            "Depositing on lending pool failed !!"
        );

        isParticipant[msg.sender] = true;
        totalParticipants++;

        emit NewParticipant(msg.sender);
    }

    function bid(uint256 bidAmount) public {
        require(
            block.timestamp >= nextAutionStartTimestamp() &&
                block.timestamp <= nextAutionCloseTimestamp(),
            "Auction for this month is over !!"
        );

        require(
            isParticipant[msg.sender],
            "You are not a participant of this pool"
        );
        require(!takenLoan[msg.sender], "You have already taken a loan !!");

        require(
            bidAmount >= minimumBidAmount &&
                bidAmount > highestBidAmount[getTermCount()],
            "Bid Amount must be greater than current bid amount and min bid amount !!"
        );

        require(
            bidAmount >= minimumBidAmount &&
                bidAmount > highestBidAmount[getTermCount()],
            "Bid Amount must be greater than current bid amount and min bid amount !!"
        );

        highestBidAmount[getTermCount()] = bidAmount;
        highestBidder[getTermCount()] = msg.sender;

        loanAmount[msg.sender] = collateralAmount - bidAmount;

        emit NewBidder(msg.sender, bidAmount, getTermCount(), block.timestamp);
    }

    function claimLoan() public {
        require(
            highestBidder[getTermCount() - 1] == msg.sender,
            "You are not the highest bidder !!"
        );
        require(
            withdraw(loanAmount[msg.sender] * 10**token.decimals()),
            "Withdrawl from lending pool failed !!"
        );

        takenLoan[msg.sender] = true;
        loanerCount++;

        token.transfer(
            msg.sender,
            loanAmount[msg.sender] * 10**token.decimals()
        );

        emit ClaimedLoan(
            msg.sender,
            loanAmount[msg.sender],
            getTermCount() - 1
        );
    }

    function claimFinalYield() public {
        // poolCloseTimestamp = poolStartTimestamp +
        //      (totalParticipants * auctionInterval * 1 hours)
        require(
            block.timestamp >
                (poolStartTimestamp +
                    (totalParticipants * auctionInterval * 1 hours)),
            "Pool is still active !!"
        );
        require(
            isParticipant[msg.sender],
            "You are not a participant of this pool"
        );

        require(
            withdraw(finalReturnAmount()),
            "Withdrawl from lending pool failed !!"
        );

        token.transfer(msg.sender, finalReturnAmount());

        emit ClaimedFinalYield(msg.sender, finalReturnAmount());
    }

    function finalReturnAmount() internal view returns (uint256) {
        return
            ((getPoolBalance() -
                ((totalParticipants - loanerCount) *
                    collateralAmount *
                    10**token.decimals())) / totalParticipants) +
            (
                takenLoan[msg.sender]
                    ? 0
                    : collateralAmount * 10**token.decimals()
            );
    }

    function getTermCount() public view returns (uint256) {
        return
            ((block.timestamp - poolStartTimestamp) /
                (auctionInterval * 1 hours)) + 1;
    }

    function nextAutionStartTimestamp() public view returns (uint256) {
        return
            poolStartTimestamp + (getTermCount() * auctionInterval * 1 hours);
    }

    function nextAutionCloseTimestamp() public view returns (uint256) {
        return nextAutionStartTimestamp() + auctionDuration;
    }
}
