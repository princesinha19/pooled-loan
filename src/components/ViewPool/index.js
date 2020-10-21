import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SwapToken from "../SwapToken";
import history from "../Utils/history";
import Loading from "../Utils/Loading";
import AlertModal from "../Utils/AlertModal";
import SuccessModal from "../Utils/SuccessModal";
import metamask from "../../assets/metamask.png";
import { precision } from "../../utils/precision";
import { marlin } from "../../utils/marlin";
import { time } from "../../utils/time";
import * as erc20Abi from "../../abis/erc20Abi.json"
import * as loanPoolAaveAbi from "../../abis/loanPoolAave.json";
import * as loanPoolMstableAbi from "../../abis/loanPoolMstable.json";
import Bid from "../Bid";
import {
    Card,
    Row,
    Col,
    Image,
    Button,
    CardDeck
} from "react-bootstrap";
import Participate from "../Participate";

export default function ViewPool() {
    let routes;
    const DAI = "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD";
    const mUSD = "0x70605Bdd16e52c86FC7031446D995Cf5c7E1b0e7";
    const { lendingPool, loanPoolAddress } = useParams();
    const [loading, setLoading] = useState(true);
    let [erc20Instance, setErc20Instance] = useState();
    let [contractInstance, setContractInstance] = useState();
    const [state, setState] = useState({
        maxBidAmount: 0,
        minBidAmount: 0,
        poolStartTimestamp: 0,
        isParticipant: false,
        alreadyTakenLoan: false,
        loanAmount: 0,
        collateralAmount: 0,
        totalParticipants: 0,
        auctionCount: 0,
        autionStartTimestamp: 0,
        autionCloseTimestamp: 0,
        auctionInterval: 0,
        poolCloseTimestamp: 0,
        highestBidAmount: 0,
        isLoanWinner: false,
        winnerInAuction: 0,
        userCurrentBid: 0,
        claimedFinalYield: false,
        erc20Balance: 0,
        createdAt: 0,
    });
    const [successModal, setSuccessModal] = useState({
        msg: "",
        open: false
    });
    const [errorModal, setErrorModal] = useState({
        msg: "",
        open: false
    });
    const [claimingLoan, setClaimingLoan] = useState(false);
    const [claimingYield, setClaimingYield] = useState(false);
    const [showBid, setShowBid] = useState(false);
    const [showParticipate, setShowParticipate] = useState(false);
    const [showMetamaskError, setShowMetamaskError] = useState(false);

    const handleClaimLoan = async () => {
        contractInstance.methods.claimLoan()
            .send()
            .on('transactionHash', () => {
                setClaimingLoan(true);
            })
            .on('receipt', () => {
                setClaimingLoan(false);
                fetchContractData();
                setSuccessModal({
                    open: true,
                    msg: "Congratulations 🎉 !! " +
                        "You received loan amount in your wallet !!",
                });
            })
            .catch((error) => {
                setClaimingLoan(false);
                setErrorModal({
                    open: true,
                    // onConfirm={handleReload}
                    msg: error.message,
                });
            });
    }

    const handleClaimFinalYield = async () => {
        contractInstance.methods.claimFinalYield()
            .send()
            .on('transactionHash', () => {
                setClaimingYield(true);
            })
            .on('receipt', () => {
                setClaimingYield(false);
                fetchContractData();
                setSuccessModal({
                    open: true,
                    msg: "Congratulations 🎉 !! " +
                        "You received your final yield !!",
                });
            })
            .catch((error) => {
                setClaimingYield(false);
                setErrorModal({
                    open: true,
                    msg: error.message,
                });
            });
    }

    const fetchContractData = async () => {
        try {
            let result;
            if (!contractInstance) {
                result = await createContractInstance();
            }

            contractInstance = contractInstance ? contractInstance : result.contract;
            erc20Instance = erc20Instance ? erc20Instance : result.erc20;

            if (contractInstance) {
                const result = await marlin.fetchPoolInfo(
                    loanPoolAddress
                );

                const isParticipant = await contractInstance
                    .methods.isParticipant(window.userAddress).call();

                const alreadyTakenLoan = await contractInstance
                    .methods.takenLoan(window.userAddress).call();

                const totalParticipants = await contractInstance
                    .methods.totalParticipants().call();

                const auctionCount = await contractInstance
                    .methods.getAuctionCount().call();

                const userCurrentBid = await marlin.fetchUserBid(
                    loanPoolAddress, window.userAddress, auctionCount
                );

                const highestBidAmount = await contractInstance
                    .methods.highestBidAmount(auctionCount).call();

                const poolCloseTimestamp = await contractInstance
                    .methods.poolCloseTimestamp().call();

                let autionStartTimestamp, autionCloseTimestamp;
                if (Number(totalParticipants) > 1) {
                    autionStartTimestamp = await contractInstance
                        .methods.nextAutionStartTimestamp().call();

                    autionCloseTimestamp = await contractInstance
                        .methods.nextAutionCloseTimestamp().call();
                }

                let isLoanWinner = false, winnerInAuction = 0;
                if (Number(auctionCount) > 0) {
                    const loanStatus = await contractInstance
                        .methods.checkWinnerStatus(window.userAddress).call();

                    winnerInAuction = loanStatus[1];

                    if (winnerInAuction < auctionCount ||
                        (Number(auctionCount) === Number(totalParticipants) - 1 &&
                            time.currentUnixTime() > Number(autionCloseTimestamp))
                    ) {
                        isLoanWinner = loanStatus[0];
                    }
                }

                let loanAmount;
                if (isLoanWinner || alreadyTakenLoan) {
                    loanAmount = await contractInstance
                        .methods.loanAmount(window.userAddress).call();
                }

                let claimedFinalYield;
                if (time.currentUnixTime() >= Number(poolCloseTimestamp)) {
                    claimedFinalYield = await contractInstance
                        .methods.claimedFinalYield(window.userAddress).call();
                }

                let erc20Balance = await precision.remove(await erc20Instance
                    .methods.balanceOf(window.userAddress).call(), 18);

                const maxBidAmount = Number(result.collateralAmount) /
                    Number(result.maxParticipants);

                setState({
                    isParticipant,
                    alreadyTakenLoan,
                    loanAmount,
                    totalParticipants,
                    auctionCount,
                    autionStartTimestamp,
                    autionCloseTimestamp,
                    highestBidAmount,
                    isLoanWinner,
                    winnerInAuction,
                    poolCloseTimestamp,
                    erc20Balance,
                    maxBidAmount,
                    userCurrentBid,
                    claimedFinalYield,
                    minBidAmount: Number(result.minimumBidAmount),
                    collateralAmount: Number(result.collateralAmount),
                    auctionInterval: Number(result.auctionInterval),
                    createdAt: Number(result.createdAt),
                });
                setShowParticipate(false);
                setShowBid(false);

                setLoading(false);
            }
        } catch (error) {
            setErrorModal({
                open: true,
                msg: error.message,
            });
        }
    };

    const createContractInstance = () => {
        return new Promise((resolve, reject) => {
            try {
                let contract;
                if (lendingPool === "Aave") {
                    contract = new window.web3.eth.Contract(
                        loanPoolAaveAbi.default,
                        loanPoolAddress,
                        { from: window.userAddress }
                    );
                } else if (lendingPool === "Mstable") {
                    contract = new window.web3.eth.Contract(
                        loanPoolMstableAbi.default,
                        loanPoolAddress,
                        { from: window.userAddress }
                    );
                }

                const erc20 = new window.web3.eth.Contract(
                    erc20Abi.default,
                    lendingPool === "Aave" ? DAI : mUSD,
                    { from: window.userAddress }
                );

                setErc20Instance(erc20);
                setContractInstance(contract);
                resolve({ contract, erc20 });
            } catch (error) {
                reject(error);
            }
        });
    };

    const getTokenSymbol = () => {
        return lendingPool === "Aave" ?
            "DAI" :
            "mUSD";
    }

    useEffect(() => {
        if (typeof window.ethereum === 'undefined' ||
            !window.ethereum.isConnected() ||
            !window.ethereum.selectedAddress
        ) {
            setLoading(false);
            setShowMetamaskError(true);
        }

        if (typeof window.ethereum !== 'undefined' &&
            window.ethereum.selectedAddress &&
            window.ethereum.isConnected() &&
            !state.isParticipant
        ) {
            fetchContractData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) {
        routes = <Loading />;
    } else {
        routes = (
            <div>
                {showMetamaskError ?
                    <AlertModal
                        open={showMetamaskError}
                        toggle={() => {
                            setShowMetamaskError(false);
                            history.push('/');
                        }}
                    >
                        <div>
                            {typeof window.ethereum === 'undefined' ?
                                <div>
                                    You can't use these features without Metamask.
                                <br />
                                Please install
                                <Image width="50px" src={metamask}></Image>
                                first !!
                            </div>
                                :
                                <div>
                                    Please connect to
                                <Image width="50px" src={metamask}></Image>
                                to use this feature !!
                            </div>
                            }
                        </div>
                    </AlertModal>
                    :
                    <CardDeck>
                        <Card className="hidden-card"></Card>

                        <Card className="mx-auto view-pool-card">
                            <Card.Body style={{ textAlign: "left", fontWeight: "bold" }}>
                                <p className="view-pool-header">
                                    <u>Loan Pool</u>
                                </p>

                                <Row style={{ paddingBottom: "20px" }}>
                                    <Col>
                                        <u>Total Participants</u>
                                        <span> :</span>
                                        <span className="float-right">
                                            {state.totalParticipants}
                                        </span>
                                    </Col>

                                    <Col>
                                        <u>Lending Pool</u>
                                        <span> :</span>
                                        <span className="float-right">
                                            Aave
                                    </span>
                                    </Col>
                                </Row>

                                <Row style={{ paddingBottom: "20px" }}>
                                    <Col>
                                        <u>Auction Done</u>
                                        <span> :</span>
                                        <span className="float-right">
                                            {state.totalParticipants > 1 ?
                                                state.auctionCount
                                                : 0
                                            }
                                        </span>
                                    </Col>

                                    <Col>
                                        <u>Deposit Amount</u>
                                        <span> :</span>
                                        <span className="float-right">
                                            <span>{state.collateralAmount} {getTokenSymbol()}</span>
                                        </span>
                                    </Col>
                                </Row>

                                <Row style={{ paddingBottom: "20px" }}>
                                    <Col>
                                        <u>Max Bid Amount</u>
                                        <span> : </span>
                                        <span className="float-right">
                                            <span>{state.maxBidAmount} {getTokenSymbol()}</span>
                                        </span>
                                    </Col>

                                    <Col>
                                        <u>Min Bid Amount</u>
                                        <span> : </span>
                                        <span className="float-right">
                                            <span>{state.minBidAmount} {getTokenSymbol()}</span>
                                        </span>
                                    </Col>
                                </Row>

                                {state.totalParticipants > 1 &&
                                    Number(state.autionCloseTimestamp) > time.currentUnixTime() ?
                                    <div>
                                        {time.currentUnixTime() < state.autionStartTimestamp ?
                                            <Row className="text-center" style={{ paddingBottom: "20px" }}>
                                                <Col>
                                                    <u>Next Auction Start</u>
                                                    <span> : </span>
                                                    <span>
                                                        {time.getRemaingTime(state.autionStartTimestamp)}
                                                    </span>
                                                </Col>
                                            </Row>
                                            :
                                            <div style={{ marginTop: "10px" }}>
                                                <div className="auction-message">
                                                    Auction Going On
                                                </div>
                                                <Row className="text-center" style={{ paddingBottom: "20px" }}>
                                                    <Col>
                                                        <u>Highest Bid Amount</u>
                                                        <span> : </span>
                                                        <span>
                                                            {state.highestBidAmount} {getTokenSymbol()}
                                                        </span>
                                                    </Col>
                                                </Row>
                                            </div>
                                        }

                                        <Row className="text-center">
                                            <Col>
                                                <u>Auction Close In</u>
                                                <span> : </span>
                                                <span>
                                                    {time.getRemaingTime(state.autionCloseTimestamp)}
                                                </span>
                                            </Col>
                                        </Row>
                                    </div>
                                    : (state.totalParticipants > 1 ?
                                        (
                                            Number(state.poolCloseTimestamp) < time.currentUnixTime() ?
                                                <div className="auction-alert-message">
                                                    Pool Already Closed
                                                </div>
                                                :
                                                <Row className="text-center">
                                                    <Col>
                                                        <u>Pool Closing In</u>
                                                        <span> : </span>
                                                        <span>
                                                            {time.getRemaingTime(state.poolCloseTimestamp)}
                                                        </span>
                                                    </Col>
                                                </Row>
                                        )
                                        : null
                                    )
                                }

                                {showBid ?
                                    <Bid
                                        contractInstance={contractInstance}
                                        totalAmount={state.collateralAmount}
                                        token={getTokenSymbol()}
                                        callback={fetchContractData}
                                    />
                                    : null}

                                {showParticipate ?
                                    (state.erc20Balance >= state.collateralAmount ?
                                        <Participate
                                            poolAddress={loanPoolAddress}
                                            contractInstance={contractInstance}
                                            erc20Instance={erc20Instance}
                                            buyToken={lendingPool === "Aave" ? "DAI" : "mUSD"}
                                            availableBalance={state.erc20Balance}
                                            balanaceNeeded={state.collateralAmount}
                                            callback={fetchContractData}
                                        />
                                        :
                                        <SwapToken
                                            fixedBuyToken={true}
                                            buyToken={lendingPool === "Aave" ? "DAI" : "mUSD"}
                                            availableBalance={state.erc20Balance}
                                            balanaceNeeded={state.collateralAmount}
                                        />
                                    )
                                    : null}
                            </Card.Body>

                            {state.isParticipant ?
                                (time.currentUnixTime() >= Number(state.poolCloseTimestamp) ?
                                    (!state.claimedFinalYield ?
                                        <Card.Footer className="view-pool-footer">
                                            <Button
                                                onClick={handleClaimFinalYield}
                                                variant="success"
                                            >
                                                {claimingYield ?
                                                    <div className="d-flex align-items-center">
                                                        Processing
                                                    <span className="loading ml-2"></span>
                                                    </div>
                                                    :
                                                    <div>Claim Final Yield</div>
                                                }
                                            </Button>
                                        </Card.Footer>
                                        :
                                        <div className="info-message">
                                            Thank you for your participation in the pool.<br />
                                            You have already claimed your Final yield. <br />
                                            Hope to see you on other pools
                                            <span role="img" aria-label="smile-emoji"> 🙂</span>
                                        </div>
                                    ) : (state.alreadyTakenLoan ?
                                        <div className="info-message">
                                            Congratulations
                                            <span role="img" aria-label="congratualation-emoji"> 🎉</span><br />
                                            You have already won a Loan of amount {state.loanAmount} {getTokenSymbol()}<br />
                                            Now, You can't take part in bidding process.
                                        </div>
                                        : (!state.isLoanWinner &&
                                            time.currentUnixTime() > Number(state.autionStartTimestamp) &&
                                            time.currentUnixTime() < Number(state.autionCloseTimestamp) ?
                                            <div>
                                                {state.userCurrentBid > 0 && !showBid ?
                                                    <div className="info-message">
                                                        You have successfully placed your bid
                                                    for this auction.<br />
                                                        <span>
                                                            Your bid is {state.userCurrentBid} {getTokenSymbol()}<br />
                                                        </span>
                                                    </div>
                                                    : null
                                                }

                                                <Card.Footer className="view-pool-footer">
                                                    <Button
                                                        onClick={() => setShowBid(true)}
                                                        variant="warning"
                                                    >
                                                        {state.userCurrentBid > 0 ?
                                                            <div>Want to Bid Higher ?</div>
                                                            :
                                                            <div>Want to Bid ?</div>
                                                        }
                                                    </Button>
                                                </Card.Footer>
                                            </div>

                                            : (state.isLoanWinner ?
                                                <div>
                                                    <div className="info-message">
                                                        You have successfully won the bid in auction {state.winnerInAuction}
                                                        <br />click below button to claim your loan of
                                                            <span> {state.loanAmount} {getTokenSymbol()}.</span>
                                                    </div>
                                                    <Card.Footer className="view-pool-footer">
                                                        <Button
                                                            onClick={handleClaimLoan}
                                                            variant="success"
                                                        >
                                                            {claimingLoan ?
                                                                <div className="d-flex align-items-center">
                                                                    Processing
                                                                    <span className="loading ml-2"></span>
                                                                </div>
                                                                :
                                                                <div>Claim Your Loan</div>
                                                            }
                                                        </Button>
                                                    </Card.Footer>
                                                </div>
                                                :
                                                <div className="info-message">
                                                    Thank you for your participation in the pool.<br />
                                                    {state.totalParticipants <= 1 ?
                                                        <div>
                                                            The bid will start once at least
                                                            one more person join the pool.
                                                        </div>
                                                        :
                                                        <div>
                                                            Please wait till next auction.
                                                        </div>
                                                    }
                                                </div>
                                            )
                                        )
                                    )
                                ) : (time.currentUnixTime() < (state.createdAt + state.auctionInterval * 3600) ?
                                    <Card.Footer className="view-pool-footer">
                                        <Button
                                            onClick={() => setShowParticipate(true)}
                                            variant="success"
                                        >
                                            Want to Participate ?
                                    </Button>
                                    </Card.Footer>
                                    :
                                    <div className="alert-message">
                                        Participation time already over.<br />
                                        Please check other Pools.
                                    </div>
                                )
                            }
                        </Card>

                        <Card className="hidden-card"></Card>
                    </CardDeck>
                }

                <AlertModal
                    open={errorModal.open}
                    toggle={() => setErrorModal({
                        ...errorModal, open: false
                    })}
                >
                    {errorModal.msg}
                </AlertModal>

                <SuccessModal
                    open={successModal.open}
                    toggle={() => setSuccessModal({
                        ...successModal, open: false
                    })}
                >
                    {successModal.msg}
                </SuccessModal>
            </div >
        );
    }

    return routes;
}
