const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: "*"
    }
});

const mongoose = require("mongoose");
const streams = require('./coinswitch/streams/index');
const initapis = require('./coinswitch/apis/index');
const USDTData = require('./utilities/usdtprice.margin');
global.CSXBOOK = {};
global.BIANANCEBOOK = {};
global.CSX_all_Instruments = [];
global.Binance_future_coin_pairs = [];
global.USDTPRICE = {};
global.MARGINS = {};
global.ALLTRADES = [];
global.FEtrades = {};
mongoose.connect('mongodb://localhost:27017/csx-mt');
var conn = mongoose.connection;
conn.on('connected', function () {
    console.log('database is connected successfully');
});

let socketClient = false;
setInterval(() => {
    if (socketClient) {
        if (Object.keys(global.FEtrades).length > 0) {
            global.ALLTRADES = []
            Object.keys(global.FEtrades).map((key) => {
                global.ALLTRADES.push(global.FEtrades[key])
            })
            socketClient.emit("opportunities", global.ALLTRADES);
        }
    }
}, 1000)

io.on("connection", (socket) => {
    socketClient = socket
    socket.emit("opportunities", global.TRADES);
})

const init = async () => {
    await initapis.initPublicApis();
    await streams.initStream();
    setInterval(async () => {
        await USDTData.getUSDTPriceMargin();
    }, 5000)
    // console.log("global.USDTPRICE", global.USDTPRICE);
    // console.log("global.CSXBOOK", global.CSXBOOK)
    // console.log("global.BIANANCEBOOK", global.BIANANCEBOOK)
    // console.log("instruents", global.CSX_all_Instruments)
    // console.log("Binance_future_coin_pairs", global.Binance_future_coin_pairs)
}


init();

const port = 4000;
server.listen(port, () => {
    console.log("Running at Port", port);
})
