const axios = require("axios");
const CSX_base_url = "https://exchange.coinswitch.co/api/v1/public/";
const Binance_future_coin_url = "https://fapi.binance.com/fapi/v1/exchangeInfo";
const CSX_Check_Instrument = [];

const  removeDuplicates = (arr) => {
    return arr.filter((item,
      index) => arr.indexOf(item) === index);
  }

const getInstruments = async () => {
    await axios.get(CSX_base_url + `instrument`)
        .then((response) => {
            if (response.data.data.instruments) {
                const findIntruments = response.data.data.instruments;
                findIntruments.forEach((intruments, i) => {
                    CSX_Check_Instrument.push(intruments.instrument.split("/")[0]);
                })
                if (global.Binance_future_coin_pairs.length !== undefined) {
                    global.CSX_all_Instruments = removeDuplicates(global.Binance_future_coin_pairs.filter(element => CSX_Check_Instrument.includes(element)));
                }
            }
        })
        .catch(function (error) {
            console.log("Error come in public.api.js", error)
        });
}


const getBinaceCoin = async () => {
    await axios.get(Binance_future_coin_url)
        .then((response) => {
            if (response.data.symbols) {
                const get_pairs = response.data.symbols;
                get_pairs.forEach((coin, i) => {
                    global.Binance_future_coin_pairs.push(coin.symbol.split("USDT")[0]);
                })
            }
        })
        .catch(function (error) {
            console.log("getTickerData =>", error)
        });
}




module.exports = {
    getBinaceCoin,
    getInstruments
}