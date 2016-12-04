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
module.exports = router;
//# sourceMappingURL=index.js.map