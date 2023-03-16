const { arbitrage } = require("../algorithm/algo")
const tradeModel = require("../model/trade.arb.schema");
let exchangeFees = {
    binance: 0.09,
    csx: 0.05
}

let lastQty = {}

const calculateTrangulatedArb = async (coin) => {
    if (!global.CSXBOOK[coin] || !global.BIANANCEBOOK[coin] || !global.MARGINS.reverse || !global.USDTPRICE.buyPrice || !global.USDTPRICE.sellPrice) {
        // console.log("Something missing")
        return
    };
    let trade = arbitrage({
        binanceFee: exchangeFees.binance,
        exchangeFee: exchangeFees.csx,
        buyPrice: global.USDTPRICE.buyPrice,
        sellPrice: global.USDTPRICE.sellPrice,
        binance_book: global.BIANANCEBOOK[coin],
        exchange_book: global.CSXBOOK[coin],
        marginReverse: global.MARGINS.reverse,
        marginStraight: global.MARGINS.straight,
    }
    )

    if (!trade.profit_per) {
        delete global.FEtrades[coin]
        return
    };
    if (lastQty[coin] > 0.8 * Number(trade.qty) && lastQty[coin] < 1.2 * Number(trade.qty)) return;
    lastQty[coin] = Number(trade.qty);
    global.FEtrades[coin] = trade;
    let tradesData = new tradeModel({
        type: trade.type,
        coin: trade.coin,
        qty: trade.qty,
        bltp: trade.bltp,
        fp: trade.fp,
        profit: trade.profit,
        profit_per: trade.profit_per,
        buyPrice: trade.buyPrice,
        sellPrice: trade.sellPrice,
        bWAP: trade.bWAP,
        eWAP: trade.eWAP
    })

    tradesData.save().then((res, err) => {
        err && console.log(err)
    })
}

module.exports = {
    calculateTrangulatedArb
}