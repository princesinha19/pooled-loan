import React, { useState } from "react";
import AlertModal from "../Utils/AlertModal";
import SuccessModal from "../Utils/SuccessModal";
import {
    Row,
    Col,
    Form,
    Button,
    Card,
} from "react-bootstrap";

export default function Bid({
    contractInstance,
    totalAmount,
    token,
    callback
}) {
    const [bidAmount, setBidAmount] = useState("");
    const [successModal, setSuccessModal] = useState({
        msg: "",
        open: false
    });
    const [errorModal, setErrorModal] = useState({
        msg: "",
        open: false
    });
    const [bidding, setBidding] = useState(false);

    const handleBid = async () => {
        contractInstance.methods.bid(bidAmount)
            .send()
            .on('transactionHash', () => {
                setBidding(true);
            })
            .on('receipt', () => {
                setBidding(false);
                setSuccessModal({
                    open: true,
                    msg: "Congratulations 🎉 !! " +
                        "You have successfully made your bid !!",
                });
                callback();
            })
            .catch((error) => {
                setBidding(false);
                setErrorModal({
                    open: true,
                    msg: error.message,
                });
            });
    }

    return (
        <div>
            <Card
                className="mx-auto participate-card text-center"
                style={{ backgroundColor: "rgb(253, 255, 255)" }}
            >
                <Card.Body>
                    <Row>
                        <Col>
                            <p className="bid-header-text">
                                <u>Make Your Bid</u>
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ textAlign: "center", fontWeight: "bold" }}>
                            Bid Amount:
                        </Col>
                        <Col>
                            <Form.Control
                                className="mb-4"
                                type="number"
                                placeholder="Amount"
                                onChange={
                                    (e) => setBidAmount(e.target.value)
                                }
                                style={{ width: "60%" }}
                                value={bidAmount}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="auction-message">
                            You will receive loan of {totalAmount - bidAmount} {token}
                        </Col>
                    </Row>
                    <Row className="text-center">
                        <Col>
                            <Button
                                onClick={handleBid}
                                variant="outline-success"
                            >
                                {bidding ?
                                    <div className="d-flex align-items-center">
                                        Processing
                            <span className="loading ml-2"></span>
                                    </div>
                                    :
                                    <div> Submit</div>
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
                onConfirm={callback}
            >
                {successModal.msg}
            </SuccessModal>
        </div>
    );
}
