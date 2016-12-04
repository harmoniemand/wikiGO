const express = require('express');
const router = express.Router();
const wdk = require('wikidata-sdk');
const rp = require('request-promise');
const Handlebars = require('handlebars');
const merge = require('merge');

/* GET home page. */
router.get('/for-place-ids', function (req, res, next) {
    let ids = req.query.ids.split(',');
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

router.post('/for-place/:placeId/complete/:challengeType', function (req, res, next) {
    let placeId = req.params.placeId;
    let challengeType = req.params.challengeType;
    console.log(placeId, challengeType);
    db.collection("challenges").update({"_id":placeId}, {$pull:{"list":{"type":challengeType}}}).then(() => {
        res.json({completed: true});
    }).catch((err) => {
        res.json({completed: true, error: true});
    })
});


module.exports = router;
