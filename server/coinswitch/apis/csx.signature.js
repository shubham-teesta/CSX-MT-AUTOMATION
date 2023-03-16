
const apiSecret = 'eae277f20ef623e669d4271adf7917f5128b9fe958e1bf7d1f791494a2d14e0a'
const ed25519 = require('ed25519');

const hex = {
    decodeString(privInHex) {
        const bytes = [];
        for (let c = 0; c < privInHex.length; c += 2) {
            bytes.push(parseInt(privInHex.substr(c, 2), 16));
        }
        return bytes;
    },
    encodeToString: (bytes) => {
        const hexEncoded = [];
        for (let i = 0; i < bytes.length; i++) {
            var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
            hexEncoded.push((current >>> 4).toString(16));
            hexEncoded.push((current & 0xF).toString(16));
        }
        return hexEncoded.join("");
    }
}

const sign = (privateKey, message) => {
    const priv = hex.decodeString(privateKey);

    const { privateKey: keyFromSeed, publicKey: pK } = ed25519.MakeKeypair(Buffer.from(priv));

    const signed = ed25519.Sign(Buffer.from(message), keyFromSeed);

    const verified = ed25519.Verify(Buffer.from(message), signed, Buffer.from(pK));

    return signed.toString('hex');
}

const buildSign = (data) => {
    try {
        const { timestamp, method, urlPath, params } = data;
        const paramsString =
            (params == null || params == "" || params == undefined || Object.keys(params).length === 0) ?
                "{}" :
                JSON.stringify(params);

        const sigPayload = timestamp + method + urlPath + paramsString;
        console.log("sigPayload===", sigPayload);
        const signature = sign(apiSecret, sigPayload);
        return signature;

    } catch (err) {
        console.log("signature catch===", err)
    }
}

var signParams = {
    timestamp: 1648468142,
    method: 'GET',
    urlPath: '/api/v1/me/balance/',
}

// var signParams = {   
//     timestamp: 1648468142,   
//     method: 'POST',   
//     urlPath: '/api/v1/orders/',   
//     params: { 
//         type: 'LIMIT',
//         side: 'BUY',
//         instrument: 'BTC/INR',
//         quantityType: 'QUOTE',
//         quantity: 0.0001,
//         limitPrice: 3372094.57,
//         username: 'blockoville'
//     }
//   }

// const signature = buildSign(signParams)
// console.log("signature", signature);

module.exports = {
    buildSign
}