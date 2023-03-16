const csxBook = require("./csx.stream");
const biananceBook = require("./bianance.stream");
const initStream = async()=>{
    await csxBook.CSXbook();
    await biananceBook.biananceStream();
}

module.exports = {
    initStream
  }