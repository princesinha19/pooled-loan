import axios from 'axios';
const url = 'https://kovan.api.0x.org';
// const url = 'https://api.0x.org';

const fetchAllTokens = () => {
    return new Promise((resolve, reject) => {
        axios.get(`${url}/swap/v1/tokens`)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const fetchTokenQuote = (params) => {
    return new Promise((resolve, reject) => {
        axios.get
            (
                `${url}/swap/v1/quote?buyToken=` + 
                `${params.buyToken}&sellToken=` +
                `${params.sellToken}&buyAmount=` +
                `${Number(params.buyAmount)}`
            )
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const fetchSwapPrice = (params) => {
    return new Promise((resolve, reject) => {
        axios.get
            (
                `${url}/swap/v1/price?buyToken=` + 
                `${params.buyToken}&sellToken=` +
                `${params.sellToken}&buyAmount=` +
                `${Number(params.buyAmount)}`
            )
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const api0x = {
    fetchAllTokens,
    fetchTokenQuote,
    fetchSwapPrice,
}
