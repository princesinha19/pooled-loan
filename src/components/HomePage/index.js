import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Card, CardDeck, Image } from "react-bootstrap";
import aaveLogo from "../../assets/aave.png";
import mstableLogo from "../../assets/mstable.png";
import { marlin } from "../../utils/marlin";
import { time } from "../../utils/time";

export default function HomePage() {
    const [loanPools, setlLoanPools] = useState([]);

    const createSubArray = (pools) => {
        let chunks = [];

        while (pools.length > 4) {
            chunks.push(pools.splice(0, 4));
        }

        if (pools.length > 0) {
            chunks.push(pools);
        }

        setlLoanPools(chunks);
    }

    const getPools = async () => {
        marlin.fetchLoanPools()
            .then((pools) => {
                createSubArray(pools);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        if (loanPools.length === 0) {
            getPools();;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function DisplayCard({ pool, count }) {
        return (
            <Card key={count} className="display-pool-card" >
                <Link
                    key={count}
                    style={{ textDecoration: "none", color: "black" }}
                    to={`/view/${pool.lendingPool}/${pool.loanPool}`}
                >
                    <Card.Header style={{ marginBottom: "5px" }}>
                        <Image src={
                            pool.lendingPool === "Aave" ?
                                aaveLogo :
                                mstableLogo
                        } width="50px"></Image>
                        <span> Loan Pool</span>
                    </Card.Header>

                    <Card.Body>
                        <div style={{ marginBottom: "10px" }}>
                            Collateral Amount: {pool.collateralAmount}
                            <span> {pool.lendingPool === "Aave" ?
                                "DAI" :
                                "mUSD"}
                            </span>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            Maximum Participants: {pool.maxParticipants}
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            Minimum Bid Amount: {pool.minimumBidAmount}
                            <span> {pool.lendingPool === "Aave" ?
                                "DAI" :
                                "mUSD"}
                            </span>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            Auction Interval: Every {pool.auctionInterval} hours
                        </div>
                        <div style={{ marginBottom: "5px" }}>
                            {time.currentUnixTime() < (
                                Number(pool.createdAt) +
                                Number(pool.auctionInterval) *
                                3600
                            ) ?
                                <span className="info-message">
                                    {time.getTimeInString(
                                        Number(pool.createdAt) +
                                        Number(pool.auctionInterval) *
                                        3600
                                    )}
                                </span>
                                :
                                <span className="warning-message">
                                    Participation Already Over
                                </span>
                            }
                        </div>
                    </Card.Body>
                </Link>

            </Card>
        );
    }

    return (
        <div>
            {loanPools.map((element, key) => (
                element.length === 4 ?
                    <CardDeck key={key} style={{ margin: "2%" }}>
                        {element.map((pool, k) => (
                            <DisplayCard key={k} pool={pool} count={k} />
                        ))}
                    </CardDeck>
                    :
                    <CardDeck key={key} style={{ margin: "2%" }}>
                        {element.map((pool, k) => (
                            <DisplayCard key={k} pool={pool} count={k} />
                        ))}

                        {[...Array(4 - element.length)].map((x, i) =>
                            <Card
                                key={element.length + i + 1}
                                className="hidden-card"
                            >
                            </Card>
                        )}
                    </CardDeck>
            ))}
        </div >
    );
}
