import React, { useEffect, useState } from "react";
import SwapToken from "../SwapToken";
import AlertModal from "../Utils/AlertModal";
import metamask from "../../assets/metamask.png";
import history from "../Utils/history";
import { Card, CardDeck, Image } from "react-bootstrap";

export default function SwapTokens() {
    const [showMetamaskError, setShowMetamaskError] =
        useState(false);

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
                <CardDeck style={{ marginTop: "12%" }}>
                    <Card className="hidden-card"></Card>
                    <SwapToken fixedBuyToken={false} buyToken="DAI" />
                    <Card className="hidden-card"></Card>
                </CardDeck>
            }
        </div>
    );
}
