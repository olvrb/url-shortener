let express = require('express');
let router = express.Router();
const fs = require("fs");
const firebase = require("firebase");
const jsonConfig = require("../config.json"); 
const config = {
  apiKey: jsonConfig.apiKey,
  authDomain: jsonConfig.authDomain,
  databaseURL: jsonConfig.databaseURL,
  storageBucket: jsonConfig.storageBucket
};
firebase.initializeApp(config);
const database = firebase.database();
/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});
router.post("/generateURL", (req, res, next) => {
  try {
    let ID = makeid();
    database.ref('links/' + ID).set({
      oldURL: req.body.url,
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress //this doesn't even work what am i doing
    });
    let url = req.protocol + '://' + req.get('host') + "/url/" + ID;
    res.render("success", {
      url: url
    });
  } catch (error) {
    console.log(error);
  }

});
router.get("/api/v1/shortener", (req, res, next) => {
  let ID = makeid();
  database.ref('links/' + ID).set({
    oldURL: req.query.url,
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress //this doesn't even work what am i doing
  });
  let url = req.protocol + '://' + req.get('host') + "/url/" + ID;
  res.json({
    "status": 200,
    "data": {
        "link": url
    }
  })
});
router.get("/url/:param", (req, res, next) => {
  if (req.url === "/api/v1/shortener" || req.url === "generateURL" || req.url === "/") return;
  database.ref('links/').once("value")
    .then(e => {
      res.redirect(e.val()[req.url.replace("/url/", "")].oldURL);
    });
});
router.use(function (err, req, res, next) {
  if (err) {
    console.log('Error', err);
  } else {
    console.log('404')
  }
});
module.exports = router;

/**
 * 
 * @param {Number} length length of the ID
 * @default 5
 * @description Create a random ID
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