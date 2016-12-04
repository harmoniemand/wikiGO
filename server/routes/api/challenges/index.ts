const express = require('express');
const router = express.Router();
const wdk = require('wikidata-sdk');
const rp = require('request-promise');
const Handlebars = require('handlebars');
const merge = require('merge');

/* GET home page. */
router.get('/for-place-ids', function (req, res, next) {
    var ids = req.query.ids.split(',');
    console.log(ids);
    db.collection("challenges").find({"_id":{$in:ids}}).toArray((err, challenges) => {
        if (!!err) {
            res.json([]);
            return ;
        }
        console.log(challenges);
        res.json(challenges);
    });
});

module.exports = router;
