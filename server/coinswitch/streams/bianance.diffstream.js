const WebSocket = require('websocket').w3cwebsocket;
const axios = require("axios");
const biananceSpotDiffStreamSocket = new WebSocket('wss://stream.binance.com:9443/stream?streams=');
let biananceSpotDiffStream = {};
let bookdepth = {};
let allCoins = [];
biananceSpotDiffStreamSocket.onerror = (err) => {
    console.log("connection error", err);
}

const biananceDiffStream = async () => {
    // console.log("all coin",global.allcoin)
    if (global.CSX_all_Instruments) {
        allCoins = global.CSX_all_Instruments;
        allCoins[0].forEach(async (coin, index) => {
            const res = await axios.get(`https://api.binance.com/api/v3/depth?symbol=${coin}&limit=100`)
                .then((response) => {
                    return response.data;
                })
                .catch(function (error) {
                    console.log(error)
                });
            if (!res) return;
            bookdepth[coin] = {
                'bids': Object.fromEntries(res.bids),
                'asks': Object.fromEntries(res.asks),
                'lastUpdateId': res.lastUpdateId
            };
        })
    }

    let finalCoin = [];
    let tempCoin = [];

    global.CSX_all_Instruments.forEach((coin, index) => {
        if (tempCoin.length === 79 || global.CSX_all_Instruments.length - 1 == index) {
            finalCoin.push(tempCoin);
            tempCoin = [];
        }
        tempCoin.push(`${coin.toLowerCase()}usdt@depth10@1000ms`);
    })

    biananceSpotDiffStreamSocket.onopen = async () => {
        console.log("Connected to binance diff stream")
        biananceSpotDiffStreamSocket.send(JSON.stringify({
            "method": "SUBSCRIBE",
            "params": finalCoin[index],
            "id": 1
        }))
    }

    biananceSpotDiffStreamSocket.onmessage = async (e) => {
        let finalAsks = [];
        let finalBids = [];
        let { stream } = JSON.parse(e.data);
        if (stream) {
            const { b, a, u, s } = JSON.parse(e.data).data;
            const greaterlength = Math.max(b.length, a.length);

            console.log(`Data for ${s} nad length is ${greaterlength}`)
            if (!bookdepth[s]) return;
            for (i = 0; i < greaterlength; i++) {
                if (b[i]) {
                    let price = b[i][0];
                    let qty = b[i][1];
                    if (Number(qty) == 0) {
                        delete bookdepth[s]['bids'][price]
                    }
                    else {
                        bookdepth[s]['bids'][price] = qty
                    }
                }
                if (a[i]) {
                    let price = a[i][0];
                    let qty = a[i][1];
                    if (Number(qty) == 0) {
                        delete bookdepth[s]['asks'][price]
                    }
                    else {
                        bookdepth[s]['asks'][price] = qty
                    }
                }
            }
            let logObj = {
                ...bookdepth[s],
                bids: Object.entries(bookdepth[s]['bids']).sort((bids1, bids2) => {
                    return bids2[0] - bids1[0]     //bids price in DES order
                }).slice(0, 10),
                asks: Object.entries(bookdepth[s]['asks']).sort((ask1, ask2) => {
                    return ask1[0] - ask2[0]      //bids price in ASC order
                }).slice(0, 10)
            }
            console.clear()
            console.log(logObj)
        }
    };

}

module.exports = {
    biananceDiffStream
}