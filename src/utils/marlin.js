import axios from 'axios';
const marlinApi = "http://graph.marlin.pro/subgraphs/name";

const fetchLoanPools = () => {
    return new Promise((resolve, reject) => {
        axios.post
            (`${marlinApi}/ayushkaul/pooled-loan`,
                {
                    "query": `{
                        loanPools(orderBy: createdAt, orderDirection: desc) {
                            id, 
                            loanPool, 
                            collateralAmount, 
                            maxParticipants, 
                            lendingPool, 
                            auctionInterval, 
                            minimumBidAmount,
                            createdAt,
                        }
                    }`
                }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then((res) => {
                resolve(res.data.data.loanPools);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const fetchPoolInfo = (poolAddress) => {
    return new Promise((resolve, reject) => {
        axios.post
            (`${marlinApi}/ayushkaul/pooled-loan`,
                {
                    "query": `
                        query ($loanPool: String!) { loanPools(where: {
                            loanPool: $loanPool
                        }){
                            collateralAmount, 
                            maxParticipants, 
                            minimumBidAmount,
                            auctionInterval,
                            createdAt,
                        }
                        
                    }`,
                    variables: {
                        loanPool: poolAddress
                    }
                }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then((res) => {
                resolve(res.data.data.loanPools[0]);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const fetchUserBid = (poolAddress, userAddress, auctionTerm) => {
    return new Promise((resolve, reject) => {
        axios.post
            (`${marlinApi}/ayushkaul/pooled-loan`,
                {
                    "query": `
                        query ($loanPool: String!, $bidder: String, $term: String) { 
                            bids(where: {
                                loanPool: $loanPool, bidder: $bidder, term: $term
                            }
                        ){
                            amount,
                        }
                    }`,
                    variables: {
                        bidder: userAddress,
                        loanPool: poolAddress,
                        term: auctionTerm,
                    }
                }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then((res) => {
                if (res.data.data.bids.length > 0) {
                    resolve(
                        res.data.data.bids[
                            res.data.data.bids.length - 1
                        ].amount
                    );
                } else {
                    resolve(0);
                }
            })
            .catch((error) => {
                console.log(error)
                reject(error);
            });
    });
}

export const marlin = {
    fetchLoanPools,
    fetchPoolInfo,
    fetchUserBid,
};
