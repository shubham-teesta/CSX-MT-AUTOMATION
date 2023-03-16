const socketConfigs = {
  reconnection: true,
}
const io = require('socket.io-client')('wss://exchange-websocket.coinswitch.co', socketConfigs);
const calculateArb = require('../../controllers/calculate.arb');

io.onerror = (err) => {
  console.log("connection error", err);
}

const CSXbook = async () => {

  io.on('connect', async () => {
    console.log('Connected to Socket');
    global.CSX_all_Instruments.forEach((pair, index) => {
      io.emit('DEPTH_UPDATE', {
        "event": "subscribe",
        "pair": pair + "/INR"
      })
    })
  });

  io.on('DEPTH_UPDATE', async (data) => {
    if (data?.Instrument) {
      let instrument = data?.Instrument?.split('/')[0]
      global.CSXBOOK[instrument] = {
        Buy: data.Buy,
        Sell: data.Sell
      }
      // console.log(global.CSXBOOK)
      await calculateArb.calculateTrangulatedArb(instrument);
    }
  });
}

module.exports = {
  CSXbook
}