const axios = require("axios");
const { buildSign } = require("./csx.signature");


const getBalance = async (COIN) => {
    let Ts = Math.floor(Date.now() / 1000)
    const signParams = {
        timestamp: Ts,
        method: 'GET',
        urlPath: `/api/v1/me/balance?asset=${COIN}`
    }
    const signature = await buildSign(signParams)
    console.log('signature', signature)
    console.log('Ts', Ts);

    const res = await axios.get(`https://exchange.coinswitch.co/api/v1/me/balance?asset=${COIN}`, {
        headers: {
            "CSX-ACCESS-KEY": "44c7a8074cafb3e0d575fa24fa629994aadfa2533da877d7cc0176c6770b614d",
            "CSX-SIGNATURE": signature,
            "CSX-ACCESS-TIMESTAMP": Ts
        }
    })
        .then((response) => {
            console.log("check ===>", response?.data?.data?.balance)
        })
        .catch(function (error) {
            console.log(error.response)
        });
}


const createOrder = async()=>{
let Ts = Math.floor(Date.now() / 1000)
const signParams = {
    timestamp: Ts,
    method: 'POST',
    urlPath: "/api/v1/orders/"
}
const signature = await buildSign(signParams)

const order = {
    "instrument": "BTC/INR",
    "limitPrice": "3700000",
    "postOnly": false,
    "quantity": "60.5",
    "quantityType": "QUOTE",
    "side": "BUY",
    "tdsDeducted": false,
    "type": "LIMIT",
    "username": "teesta"
  }

const res = await axios.post(`https://exchange.coinswitch.co/api/v1/orders/`,{
    headers: {
        "CSX-ACCESS-KEY": "44c7a8074cafb3e0d575fa24fa629994aadfa2533da877d7cc0176c6770b614d",
        "CSX-SIGNATURE": signature,
        "CSX-ACCESS-TIMESTAMP": Ts
    }
}, order)
    .then((response) => {
        console.log("check ===>", response)
    })
    .catch(function (error) {
        console.log(error.response)
    });
}

// getBa9lance("BTC")
createOrder()