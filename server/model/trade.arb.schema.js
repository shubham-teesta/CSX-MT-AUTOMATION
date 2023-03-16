const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let tradeKey = new Schema({
    type: String,
    coin: String,
    qty: Number,
    bltp: Number,
    fp: Number,
    profit: Number,
    profit_per: Number,
    buyPrice: Number,
    sellPrice: Number,
    bWAP: Number,
    eWAP: Number,
    timestamp: {
        type: Date,
        default: () => Date.now()
    }
})

const model = mongoose.model("trade", tradeKey);

module.exports = model;