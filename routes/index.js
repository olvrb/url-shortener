let express = require('express');
let router = express.Router();
const fs = require("fs");
/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});
router.post("/generateURL", (req, res, next) => {
  let db = JSON.parse(fs.readFileSync("./db.json").toString(), true);
  let ID = makeid();
  if (db.links.find(e => e.ID == ID)) ID = makeid(); //regenerate id if it exists, the odds of the new ID existing are one in `2.687292e+111`
  const urlObj = {
    oldURL: req.body.url,
    ID: ID,
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
  }
  db.links.push(urlObj);
  console.log(`${req.protocol + '://' + req.get('host')}/${urlObj.ID}`);
  fs.writeFileSync("./db.json", JSON.stringify(db));
  let url = req.protocol + '://' + req.get('host') + "/" + urlObj.ID;
  res.render("success", {
    url: url
  });
});
router.get("/api/v1/shortener", (req, res, next) => {
  let db = JSON.parse(fs.readFileSync("./db.json").toString(), true);
  let ID = makeid();
  if (db.links.find(e => e.ID == ID)) ID = makeid(); //regenerate id if it exists, the odds of the new ID existing are one in `2.687292e+111`
  const urlObj = {
    oldURL: req.query.url,
    ID: ID,
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
  }
  db.links.push(urlObj);
  fs.writeFileSync("./db.json", JSON.stringify(db));
  let url = req.protocol + '://' + req.get('host') + "/" + urlObj.ID;
  res.json({
    "status": 200,
    "data": {
        "link": url
    }
  })
});
router.get("*", (req, res, next) => {
  let db = JSON.parse(fs.readFileSync("./db.json").toString(), true);
  let newRedir = db.links.find(e => e.ID == req.url.replace("/", "")); //hacky but working way
  if (!newRedir) return res.render("error");
  res.redirect(newRedir.oldURL);
});
module.exports = router;

/**
 * 
 * @param {Number} length 
 * @default {5}
 * @returns {String} random id
 */
function makeid(length = 5) {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}