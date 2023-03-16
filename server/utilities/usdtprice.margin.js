const axios = require("axios");
const USDTurl = "http://13.127.191.252:4000/price";
const calculateArb = require('../controllers/calculate.arb');


const getUSDTPriceMargin = async () => {
    await axios.get(USDTurl)
    .then(async (response) => {
        if (response.data.d_buy_price && response.data.d_sell_price) {
                // console.log('Fetched Price')
                // console.log("check =>",response)
                global.USDTPRICE = {
                    sellPrice: response.data.d_sell_price,
                    buyPrice: response.data.d_buy_price
                }
                global.MARGINS = {
                    reverse: response.data.dcx_rev,
                    straight: response.data.dcx_str
                }
                // await calculateArb.calculateTrangulatedArb();
            }
        })
        .catch(function (error) {
            // console.log(error)
        });
}


module.exports = {
    getUSDTPriceMargin
}