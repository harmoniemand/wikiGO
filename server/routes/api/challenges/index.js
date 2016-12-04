var express = require('express');
var router = express.Router();
var wdk = require('wikidata-sdk');
var rp = require('request-promise');
var Handlebars = require('handlebars');
var merge = require('merge');
/* GET home page. */
router.get('/for-place-ids', function (req, res, next) {
    var ids = req.query.ids.split(',');
    console.log(ids);
    db.collection("challenges").find({ "_id": { $in: ids } }).toArray(function (err, challenges) {
        if (!!err) {
            res.json([]);
            return;
        }
        console.log(challenges);
        res.json(challenges);
    });
});
router.post('/for-place/:placeId/complete/:challengeType', function (req, res, next) {
    var placeId = req.params.placeId;
    var challengeType = req.params.challengeType;
    console.log(placeId, challengeType);
    db.collection("challenges").update({ "_id": placeId }, { $pull: { "list": { "type": challengeType } } }).then(function () {
        res.json({ completed: true });
    }).catch(function (err) {
        res.json({ completed: true, error: true });
    });
});
module.exports = router;
//# sourceMappingURL=index.js.map