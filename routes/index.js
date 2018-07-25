let express = require("express");
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
router.get("/", (req, res, next) => {
    res.render("index");
});
router.post("/api/v2/generate", (req, res, next) => {
    try {
        console.log((req.body));
        let ID = makeid();
        database.ref("links/" + ID).set({
            oldURL: req.body.url,
            ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
            timestamp: +new Date()
        });
        let url = req.protocol + "://" + req.get("host") + "/" + ID;
        res.status(200).json({
            url: url,
            uniq: ID
        });
    } catch (error) {
        console.log(error);
    }
});
router.get("/:param", (req, res, next) => {
    if (
        req.url === "/api/v2/shortener" ||
        req.url === "/"
    )
        return;
    database
        .ref("links/")
        .once("value")
        .then(e => {
            res.redirect(e.val()[req.url.replace("/", "")].oldURL);
        });
});
router.use(function (err, req, res, next) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("404");
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
    let possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
