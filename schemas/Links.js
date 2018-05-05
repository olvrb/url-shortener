const mongoose = require("mongoose");
let LinkSchema = new mongoose.Schema({
    oldLink: String,
    newLinkExt: String
});
let Links = new mongoose.Schema({
    amountOfLinks: Number,
    linkArr: [LinkSchema]
});
module.exports = LinkSchema;