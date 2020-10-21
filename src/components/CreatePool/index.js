import React, { useEffect, useState } from "react";
import AlertModal from "../Utils/AlertModal";
import SuccessModal from "../Utils/SuccessModal";
import metamask from "../../assets/metamask.png";
import history from "../Utils/history";
import {
    Row,
    Col,
    Form,
    Card,
    Image,
    Button,
    CardDeck,
    Dropdown,
    DropdownButton,
} from "react-bootstrap";

export default function CreatePool() {
    const [processing, setProcessing] = useState(false);
    const [addPoolState, setAddPoolState] = useState({
        maximumBidAmount: "",
        minimumBidAmount: "",
        auctionInterval: "",
        auctionDuration: "",
        maxParticipants: "",
        token: "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD",
    });

    const [showMetamaskError, setShowMetamaskError] = useState(
        false
    );

    const [errorModal, setErrorModal] = useState({
        msg: "",
        open: false
    });

    const [successModal, setSuccessModal] = useState({
        msg: "",
        open: false
    });

    const [lendingPool] = useState([
        { pool: "Aave", token: "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD" },
        { pool: "Mstable", token: "0x70605Bdd16e52c86FC7031446D995Cf5c7E1b0e7" }
    ]);

    const handleCreatePool = () => {
        window.loanPoolFactory.methods
            .addLoanPool(
                addPoolState.maximumBidAmount,
                addPoolState.minimumBidAmount,
                addPoolState.auctionInterval,
                addPoolState.auctionDuration,
                addPoolState.maxParticipants,
                addPoolState.token,
            )
            .send()
            .on('transactionHash', () => {
                setProcessing(true);
            })
            .on('receipt', (_) => {
                setProcessing(false);
                setSuccessModal({
                    open: true,
                    msg: "Congratulations 🎉 !! " +
                        "Pool successfully created !! " +
                        "Within 2 minutes you will be able to " +
                        "see created pool on the dashboard.",
                });
            })
            .catch((error) => {
                setProcessing(false);
                setErrorModal({
                    open: true,
                    msg: error.message,
                });
                console.log(error.message)
            });
    };

    useEffect(() => {
        if (typeof window.ethereum === 'undefined' ||
            !window.ethereum.selectedAddress
        ) {
            setShowMetamaskError(true);
        }
    }, []);

    return (
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

                    <Card className="mx-auto form-card">
                        <Card.Header>
                            <u>Create Loan Pool</u>
                        </Card.Header>

                        <Card.Body>
                            <Row style={{ marginTop: "10px" }}>
                                <Col className="text-header">
                                    Collateral Amount:
                                </Col>
                                <Col style={{ paddingLeft: "0px" }}>
                                    <Form.Control
                                        className="mb-4"
                                        type="number"
                                        placeholder="(Max Bid Amount * Max Participants)"
                                        style={{ width: "80%" }}
                                        value={
                                            (addPoolState.maximumBidAmount *
                                                (addPoolState.maxParticipants > 0 ?
                                                    addPoolState.maxParticipants : 1
                                                ) > 0 ?
                                                addPoolState.maximumBidAmount *
                                                (addPoolState.maxParticipants > 0 ?
                                                    addPoolState.maxParticipants : 1
                                                )
                                                : ""
                                            )
                                        }
                                        disabled={true}
                                    />
                                </Col>
                            </Row>

                            <Row>
                                <Col className="text-header">
                                    Maximum Bid Amount:
                                </Col>
                                <Col style={{ paddingLeft: "0px" }}>
                                    <Form.Control
                                        className="mb-4"
                                        type="number"
                                        step="0"
                                        placeholder="No decimal places"
                                        onChange={(e) => setAddPoolState({
                                            ...addPoolState,
                                            maximumBidAmount: e.target.value
                                        })}
                                        style={{ width: "80%" }}
                                        value={addPoolState.maximumBidAmount}
                                        required
                                    />
                                </Col>
                            </Row>

                            <Row>
                                <Col className="text-header">
                                    Maximum Participants:
                                </Col>
                                <Col style={{ paddingLeft: "0px" }}>
                                    <Form.Control
                                        className="mb-4"
                                        type="number"
                                        step="0"
                                        placeholder="No decimal places"
                                        onChange={(e) => setAddPoolState({
                                            ...addPoolState,
                                            maxParticipants: e.target.value
                                        })}
                                        style={{ width: "80%" }}
                                        value={addPoolState.maxParticipants}
                                        required
                                    />
                                </Col>
                            </Row>

                            <Row>
                                <Col className="text-header">
                                    Minimum Bid Amount:
                                </Col>
                                <Col style={{ paddingLeft: "0px" }}>
                                    <Form.Control
                                        className="mb-4"
                                        type="number"
                                        step="0"
                                        placeholder="No decimal places"
                                        onChange={(e) => setAddPoolState({
                                            ...addPoolState,
                                            minimumBidAmount: e.target.value
                                        })}
                                        style={{ width: "80%" }}
                                        value={addPoolState.minimumBidAmount}
                                        required
                                    />
                                </Col>
                            </Row>

                            <Row>
                                <Col className="text-header">
                                    Every Auction Interval:
                                </Col>
                                <Col style={{ paddingLeft: "0px" }}>
                                    <Form.Control
                                        className="mb-4"
                                        type="number"
                                        step="0"
                                        placeholder="In hours (Eg. 1)"
                                        onChange={(e) => setAddPoolState({
                                            ...addPoolState,
                                            auctionInterval: e.target.value
                                        })}
                                        style={{ width: "80%" }}
                                        value={addPoolState.auctionInterval}
                                        required
                                    />
                                </Col>
                            </Row>

                            <Row>
                                <Col className="text-header">
                                    Aution Duration:
                                </Col>
                                <Col style={{ paddingLeft: "0px" }}>
                                    <Form.Control
                                        className="mb-4"
                                        type="number"
                                        min="0"
                                        max={addPoolState.auctionInterval - 1}
                                        step="0"
                                        placeholder="10 (For 10 hours)"
                                        onChange={(e) => setAddPoolState({
                                            ...addPoolState,
                                            auctionDuration: e.target.value
                                        })}
                                        style={{ width: "80%" }}
                                        value={addPoolState.auctionDuration}
                                        required
                                    />
                                </Col>
                            </Row>

                            <Row style={{ marginBottom: "20px" }}>
                                <Col className="text-header">
                                    Lending Pool:
                            </Col>
                                <Col style={{ paddingLeft: "0px" }}>
                                    <DropdownButton
                                        style={{
                                            position: "absolute",
                                        }}
                                        title={lendingPool.map((element) => (
                                            addPoolState.token === element.token ?
                                                element.pool
                                                : null
                                        ))}
                                        variant="outline-info"
                                        onSelect={(e) => setAddPoolState({
                                            ...addPoolState,
                                            token: e
                                        })}
                                    >
                                        {lendingPool.map((element, key) => (
                                            <Dropdown.Item
                                                key={key}
                                                eventKey={element.token}
                                            >
                                                {element.pool}
                                            </Dropdown.Item>
                                        ))}
                                    </DropdownButton>
                                </Col>
                            </Row>
                        </Card.Body>

                        <Card.Footer className="text-center">
                            <Button
                                onClick={handleCreatePool}
                                variant="success"
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
                        </Card.Footer>
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
                onConfirm={() => history.push("/")}
            >
                {successModal.msg}
            </SuccessModal>
        </div>
    );
}
