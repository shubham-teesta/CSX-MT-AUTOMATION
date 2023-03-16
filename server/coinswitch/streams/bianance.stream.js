
//spot depth stream

const WebSocket = require('websocket').w3cwebsocket;
const biananceSpotStreamSocket = new WebSocket('wss://stream.binance.com:9443/stream?streams=');
const calculateArb = require('../../controllers/calculate.arb');
let bianaceBook = {}
biananceSpotStreamSocket.onerror = (err) => {
    console.log("connection error", err);
}

const biananceStream = async () => {
    let finalCoin = [];
    let tempCoin = [];

    global.CSX_all_Instruments.forEach((coin, index) => {
        if (tempCoin.length === 79 || global.CSX_all_Instruments.length - 1 == index) {
            finalCoin.push(tempCoin);
            tempCoin = [];
        }
        tempCoin.push(`${coin.toLowerCase()}usdt@depth10@1000ms`);
    })

    biananceSpotStreamSocket.onopen = async () => {
        finalCoin.forEach((coin, index) => {
            biananceSpotStreamSocket.send(JSON.stringify({
                "method": "SUBSCRIBE",
                "params": finalCoin[index],
                "id": 1
            }))
        })
    };

    biananceSpotStreamSocket.onmessage = async (e) => {

        let { stream } = JSON.parse(e.data);
        if (stream) {
            const { bids, asks, lastUpdateId } = JSON.parse(e.data).data;
            global.BIANANCEBOOK[(stream.split('usdt@')[0]).toUpperCase()] = {
                bids: bids,
                asks: asks,
                lastUpdateId: lastUpdateId,
                symbol: (stream.split('@')[0]).toUpperCase()
            }
            await calculateArb.calculateTrangulatedArb((stream.split('usdt@')[0]).toUpperCase());
            // console.log("global.BIANANCEBOOK", global.BIANANCEBOOK)
            // console.log("bianaceBook ==>>", bianaceBook)
            // return bianaceBook;
        }
    };
}

module.exports = {
    biananceStream
}
