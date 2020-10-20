import React, { useEffect, useState } from "react";
import { api0x } from "../../utils/0x";
import { BigNumber } from "@0x/utils";
import { ERC20TokenContract } from "@0x/contract-wrappers";
import history from "../Utils/history";
import AlertModal from "../Utils/AlertModal";
import SuccessModal from "../Utils/SuccessModal";
import { precision } from "../../utils/precision";
import {
    Row,
    Col,
    Form,
    Button,
    Dropdown,
    DropdownButton,
    Card,
} from "react-bootstrap";

export default function SwapToken({
    buyToken,
    fixedBuyToken,
    availableBalance,
    balanaceNeeded
}) {
    const [processing, setProcessing] = useState(false);
    const [allTokens, setAllTokens] = useState([]);
    const [state, setState] = useState({
        buyToken: buyToken,
        sellToken: "USDC",
        buyAmount: "1",
    });
    const [errorModal, setErrorModal] = useState({
        msg: "",
        open: false
    });
    const [successModal, setSuccessModal] = useState({
        msg: "",
        open: false
    });

    const handleSwapToken = async () => {
        try {
            const quote = await api0x.fetchTokenQuote({
                buyToken: state.buyToken,
                sellToken: state.sellToken,
                buyAmount: await precision.add(
                    state.buyAmount,
                    18,
                ),
            });

            if (state.sellToken !== "ETH") {
                let tokenAddress;
                allTokens.forEach((element) => {
                    if (state.sellToken === element.symbol)
                        tokenAddress = element.address
                });

                const contract = new ERC20TokenContract(
                    tokenAddress, window.web3.eth.currentProvider
                );
                const maxApproval = new BigNumber(2)
                    .pow(256).minus(1);

                const approvalTxData = await contract
                    .approve(quote.allowanceTarget, maxApproval)
                    .getABIEncodedTransactionData();

                await window.web3.eth.sendTransaction
                    ({
                        to: tokenAddress,
                        data: approvalTxData,
                        from: window.userAddress
                    })
                    .on("transactionHash", () => {
                        setProcessing(true);
                    });
            }

            await window.web3.eth.sendTransaction(quote)
                .on("transactionHash", () => {
                    setProcessing(true);
                })
                .on("receipt", () => {
                    setProcessing(false);
                    setSuccessModal({
                        open: true,
                        msg: "Congratulations 🎉 !!"
                    });
                });
        } catch (error) {
            setProcessing(false);
            setErrorModal({
                open: true,
                msg: error.message,
            });
        }
    };

    const fetchAllTokens = async () => {
        const tokens = await api0x.fetchAllTokens();
        setAllTokens([{ symbol: "ETH" }].concat(tokens.records));
    };

    const handleReload = () => {
        history.go(0);
    }

    useEffect(() => {
        if (allTokens.length === 0) {
            fetchAllTokens();
        }
    });

    return (
        <div>
            <Card
                className="mx-auto form-card text-center"
                style={{ backgroundColor: "rgb(253, 255, 255)" }}
            >
                <Card.Header>
                    <u>Swap Your Token</u>
                </Card.Header>

                <Card.Body>
                    {fixedBuyToken ?
                        <div>
                            <div style={{ marginBottom: "20px", color: "orange" }}>
                                You don't have enough collateral amount available in your wallet.
                                Please use another wallet or Get Token by swapping another asset
                                directly from 0x protocol using below method:
                            </div>

                            <Row className="text-center" style={{ paddingBottom: "20px" }}>
                                <Col>
                                    <u>Available Balance</u>
                                    <span> : </span>
                                    <span>{availableBalance} {buyToken}</span>
                                </Col>
                            </Row>
                            <Row className="text-center" style={{ paddingBottom: "30px" }}>
                                <Col>
                                    <u>Balance Needed</u>
                                    <span> : </span>
                                    <span>{balanaceNeeded} {buyToken}</span>
                                </Col>
                            </Row>
                        </div>
                        : null
                    }

                    <Row>
                        <Col className="text-header">
                            Buy Token:
                        </Col>
                        {fixedBuyToken ?
                            <Col style={{ paddingLeft: "0px" }}>
                                <Form.Control
                                    className="mb-4"
                                    type="text"
                                    style={{ width: "60%" }}
                                    value={state.buyToken}
                                    readOnly={!buyToken ? false : true}
                                />
                            </Col>
                            :
                            <Col
                                className="text-left float-left"
                                style={{ marginBottom: "20px", paddingLeft: "0px" }}
                            >
                                <DropdownButton
                                    title={state.buyToken}
                                    variant="outline-info"
                                    onSelect={(event) => setState({
                                        ...state,
                                        buyToken: event
                                    })}
                                >
                                    {allTokens.map((element, key) => (
                                        <Dropdown.Item
                                            key={key}
                                            eventKey={element.symbol}
                                        >
                                            {element.symbol}
                                        </Dropdown.Item>
                                    ))}
                                </DropdownButton>
                            </Col>
                        }
                    </Row>

                    <Row style={{ marginBottom: "30px" }}>
                        <Col className="text-header">
                            Sell Token:
                        </Col>
                        <Col style={{ paddingLeft: "0px" }}>
                            <DropdownButton
                                style={{
                                    position: "absolute",
                                }}
                                title={state.sellToken}
                                variant="outline-info"
                                onSelect={(event) => setState({
                                    ...state,
                                    sellToken: event
                                })}
                            >
                                {allTokens.map((element, key) => (
                                    <Dropdown.Item
                                        key={key}
                                        eventKey={element.symbol}
                                    >
                                        {element.symbol}
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="text-header">
                            Buy Amount:
                        </Col>
                        <Col style={{ paddingLeft: "0px" }}>
                            <Form.Control
                                className="mb-4"
                                type="number"
                                min="0"
                                placeholder="0"
                                onChange={async (e) => setState({
                                    ...state,
                                    buyAmount: e.target.value,
                                })}
                                style={{ width: "60%" }}
                                value={state.buyAmount}
                            />
                        </Col>
                    </Row>

                    <Row className="text-center">
                        <Col>
                            <Button
                                onClick={handleSwapToken}
                                variant="outline-success"
                            >
                                {processing ?
                                    <div className="d-flex align-items-center">
                                        Processing
                                <span className="loading ml-2"></span>
                                    </div>
                                    :
                                    <div>Submit</div>
                                }
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

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
                onConfirm={handleReload}
            >
                {successModal.msg}
            </SuccessModal>
        </div>
    );
}
