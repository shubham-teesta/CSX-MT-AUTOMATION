const publicApi = require("./public.api");


const initPublicApis = async ()=>{
   await publicApi.getBinaceCoin();
   await publicApi.getInstruments();
}


module.exports = {
    initPublicApis
  }