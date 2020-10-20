import React, { useState } from "react";
import AlertModal from "../Utils/AlertModal";
import SuccessModal from "../Utils/SuccessModal";
import { precision } from "../../utils/precision";
import { Row, Col, Button, Card } from "react-bootstrap";

export default function Participate({
    poolAddress,
    contractInstance,
    erc20Instance,
    buyToken,
    availableBalance,
    balanaceNeeded,
    callback,
}) {
    const [approving, setApproving] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errorModal, setErrorModal] = useState({
        msg: "",
        open: false
    });
    const [successModal, setSuccessModal] = useState({
        msg: "",
        open: false
    });

    const handleParticipate = async () => {
        try {
            const allowance = await precision.remove(
                await erc20Instance.methods.allowance(
                    window.userAddress,
                    poolAddress,
                ).call(),
                18
            );

            if (Number(allowance) >= Number(balanaceNeeded)) {
                participate();
            } else {
                const success = await approveToken(allowance);
                if (success) {
                    participate();
                }
            }
        } catch (error) {
            setErrorModal({
                open: true,
                msg: error.message,
            });
        }
    }

    const participate = () => {
        return new Promise((resolve, reject) => {
            contractInstance.methods.participate()
                .send()
                .on('transactionHash', () => {
                    setProcessing(true);
                })
                .on('receipt', () => {
                    setProcessing(false);
                    setSuccessModal({
                        open: true,
                        msg: "Congratulations 🎉 !! " +
                            "You have successfully deposited collateral !!",
                    });
                })
                .catch((error) => {
                    setProcessing(false);
                    reject(error);
                });
        });
    }

    const approveToken = (allowance) => {
        return new Promise(async (resolve, reject) => {
            erc20Instance.methods.approve
                (
                    poolAddress,
                    await precision.add(
                        Number(balanaceNeeded) - Number(allowance),
                        18
                    )
                )
                .send()
                .on('transactionHash', () => {
                    setApproving(true);
                })
                .on('receipt', () => {
                    setApproving(false);
                    resolve(true);
                })
                .catch((error) => {
                    setApproving(false);
                    reject(error);
                })
        });
    }

    return (
        <div>
            <Card
                className="mx-auto participate-card text-center"
                style={{ backgroundColor: "rgb(253, 255, 255)" }}
            >
                <Card.Header>
                    <u>Participation Form</u>
                </Card.Header>

                <Card.Body>
                    <div style={{ marginBottom: "20px", color: "orange" }}>
                        You are about to particpate in the pool.
                        Please click submit button to confirm your participation.
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

                    <Row className="text-center">
                        <Col>
                            <Button
                                onClick={handleParticipate}
                                variant="outline-success"
                            >
                                {approving ?
                                    <div className="d-flex align-items-center">
                                        Approving
                                        <span className="loading ml-2"></span>
                                    </div>
                                    :
                                    (processing ?
                                        <div className="d-flex align-items-center">
                                            Processing
                                        <span className="loading ml-2"></span>
                                        </div>
                                        :
                                        <div>Submit</div>
                                    )
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
        </div >
    );
}
